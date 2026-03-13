import json
import subprocess
import urllib.request
from pathlib import Path

from conftest import _find_free_port, build_server_env, run_server


def test_health_endpoint(server_url: str) -> None:
    with urllib.request.urlopen(f"{server_url}/health", timeout=5.0) as response:
        payload = json.load(response)

    assert payload["status"] == "ok"
    assert payload["service"] == "personal-crm-starter"
    assert "timestamp" in payload


def test_api_index(server_url: str) -> None:
    with urllib.request.urlopen(f"{server_url}/api", timeout=5.0) as response:
        payload = json.load(response)

    assert payload == {
        "name": "personal-crm-starter",
        "product": "Relationship CRM",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "contacts": "/api/contacts",
    }


def test_create_contact(server_url: str) -> None:
    payload = json.dumps(
        {
            "firstName": "Ada",
            "lastName": "Lovelace",
            "nextContactAt": "2026-03-20",
            "connectionTypes": ["business partner", "friend"],
            "email": "ada@example.com",
            "priority": "high",
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{server_url}/api/contacts",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=5.0) as response:
        created = json.load(response)

    assert created["firstName"] == "Ada"
    assert created["lastName"] == "Lovelace"
    assert created["fullName"] == "Ada Lovelace"
    assert created["connectionTypes"] == ["business partner", "friend"]
    assert created["priority"] == "high"

    with urllib.request.urlopen(f"{server_url}/api/contacts", timeout=5.0) as response:
        listing = json.load(response)

    assert listing["summary"]["total"] == 1
    assert listing["items"][0]["email"] == "ada@example.com"


def test_log_interaction_updates_follow_up_schedule(server_url: str) -> None:
    payload = json.dumps(
        {
            "firstName": "Grace",
            "lastName": "Hopper",
            "connectionTypes": ["customer"],
            "priority": "high",
        }
    ).encode("utf-8")

    create_request = urllib.request.Request(
        f"{server_url}/api/contacts",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(create_request, timeout=5.0) as response:
        created = json.load(response)

    interaction_payload = json.dumps(
        {
            "interactionDate": "2026-03-13",
            "summary": "Shared updated proposal and agreed on next steps.",
        }
    ).encode("utf-8")

    interaction_request = urllib.request.Request(
        f"{server_url}/api/contacts/{created['id']}/interactions",
        data=interaction_payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(interaction_request, timeout=5.0) as response:
        result = json.load(response)

    assert result["interaction"]["nextContactSource"] == "suggested"
    assert result["interaction"]["suggestedCadenceDays"] == 14
    assert result["contact"]["lastContactedAt"] == "2026-03-13"
    assert result["contact"]["nextContactAt"] == "2026-03-27"
    assert result["contact"]["interactionHistory"][0]["summary"].startswith("Shared updated")


def test_update_and_delete_contact(server_url: str) -> None:
    payload = json.dumps(
        {
            "firstName": "Margaret",
            "lastName": "Hamilton",
            "connectionTypes": ["networking acquaintance"],
        }
    ).encode("utf-8")

    create_request = urllib.request.Request(
        f"{server_url}/api/contacts",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(create_request, timeout=5.0) as response:
        created = json.load(response)

    update_payload = json.dumps(
        {
            "company": "Apollo Guidance",
            "priority": "medium",
            "preferredContactMethod": "email",
            "connectionTypes": ["networking acquaintance", "business partner"],
        }
    ).encode("utf-8")

    update_request = urllib.request.Request(
        f"{server_url}/api/contacts/{created['id']}",
        data=update_payload,
        headers={"Content-Type": "application/json"},
        method="PATCH",
    )

    with urllib.request.urlopen(update_request, timeout=5.0) as response:
        updated = json.load(response)

    assert updated["company"] == "Apollo Guidance"
    assert updated["priority"] == "medium"
    assert updated["preferredContactMethod"] == "email"
    assert updated["connectionTypes"] == ["business partner", "networking acquaintance"]

    with urllib.request.urlopen(f"{server_url}/api/contacts/{created['id']}", timeout=5.0) as response:
        fetched = json.load(response)

    assert fetched["fullName"] == "Margaret Hamilton"
    assert fetched["company"] == "Apollo Guidance"

    delete_request = urllib.request.Request(
        f"{server_url}/api/contacts/{created['id']}",
        method="DELETE",
    )

    with urllib.request.urlopen(delete_request, timeout=5.0) as response:
        assert response.status == 204

    with urllib.request.urlopen(f"{server_url}/api/contacts", timeout=5.0) as response:
        listing = json.load(response)

    assert all(item["id"] != created["id"] for item in listing["items"])


def test_contacts_persist_across_restart(tmp_path: Path) -> None:
    port = _find_free_port()
    database_path = tmp_path / "crm.sqlite"
    env = build_server_env(port, str(database_path))

    subprocess.run(["npm", "run", "build"], check=True, env=env)

    with run_server(env) as first_url:
        payload = json.dumps(
            {
                "firstName": "Katherine",
                "lastName": "Johnson",
                "lastContactedAt": "2026-03-10",
                "connectionTypes": ["networking acquaintance"],
            }
        ).encode("utf-8")

        request = urllib.request.Request(
            f"{first_url}/api/contacts",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(request, timeout=5.0) as response:
            created = json.load(response)

        assert created["firstName"] == "Katherine"

    with run_server(env) as second_url:
        with urllib.request.urlopen(f"{second_url}/api/contacts", timeout=5.0) as response:
            listing = json.load(response)

    assert listing["summary"]["total"] == 1
    assert listing["items"][0]["fullName"] == "Katherine Johnson"
