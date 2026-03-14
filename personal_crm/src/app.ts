import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { Type, type Static } from '@sinclair/typebox';

import { renderCrmPage } from './frontend.js';

const connectionOptions = [
  'friend',
  'family friend',
  'networking acquaintance',
  'business partner',
  'customer',
] as const;

const priorityOptions = ['low', 'medium', 'high'] as const;
const contactMethodOptions = ['email', 'phone', 'text', 'social', 'in-person'] as const;
const nextContactSourceOptions = ['manual', 'suggested'] as const;

type Nullable<T> = T | null;

const HealthResponseSchema = Type.Object({
  status: Type.Literal('ok'),
  service: Type.String(),
  timestamp: Type.String({ format: 'date-time' }),
});

type HealthResponse = Static<typeof HealthResponseSchema>;

const ApiIndexResponseSchema = Type.Object({
  name: Type.String(),
  product: Type.String(),
  docs: Type.String(),
  openapi: Type.String(),
  contacts: Type.String(),
});

type ApiIndexResponse = Static<typeof ApiIndexResponseSchema>;

const OpenApiResponseSchema = Type.Object({
  openapi: Type.String(),
  info: Type.Object({
    title: Type.String(),
    version: Type.String(),
  }),
  paths: Type.Record(Type.String(), Type.Unknown()),
});

type OpenApiResponse = Static<typeof OpenApiResponseSchema>;

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

const ConnectionTypeSchema = Type.Union(
  connectionOptions.map((option) => Type.Literal(option)),
);
type ConnectionType = Static<typeof ConnectionTypeSchema>;

const PrioritySchema = Type.Union(priorityOptions.map((option) => Type.Literal(option)));
type Priority = Static<typeof PrioritySchema>;

const ContactMethodSchema = Type.Union(
  contactMethodOptions.map((option) => Type.Literal(option)),
);
type ContactMethod = Static<typeof ContactMethodSchema>;

const NextContactSourceSchema = Type.Union(
  nextContactSourceOptions.map((option) => Type.Literal(option)),
);
type NextContactSource = Static<typeof NextContactSourceSchema>;

const NullableDateSchema = Type.Union([Type.String({ format: 'date' }), Type.Null()]);
const NullableEmailSchema = Type.Union([Type.String({ format: 'email' }), Type.Null()]);
const NullableNumberSchema = Type.Union([Type.Number(), Type.Null()]);
const NullableStringSchema = Type.Union([Type.String(), Type.Null()]);
const NullableContactMethodSchema = Type.Union([ContactMethodSchema, Type.Null()]);
const NullablePrioritySchema = Type.Union([PrioritySchema, Type.Null()]);

const InteractionSchema = Type.Object({
  id: Type.String(),
  contactId: Type.String(),
  interactionDate: Type.String({ format: 'date' }),
  summary: NullableStringSchema,
  nextContactAt: NullableDateSchema,
  nextContactSource: NextContactSourceSchema,
  suggestedCadenceDays: NullableNumberSchema,
  createdAt: Type.String({ format: 'date-time' }),
});

type Interaction = Static<typeof InteractionSchema>;

const ContactSchema = Type.Object({
  id: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  fullName: Type.String(),
  birthdate: NullableDateSchema,
  lastContactedAt: NullableDateSchema,
  nextContactAt: NullableDateSchema,
  connectionTypes: Type.Array(ConnectionTypeSchema),
  company: NullableStringSchema,
  title: NullableStringSchema,
  email: NullableEmailSchema,
  phone: NullableStringSchema,
  location: NullableStringSchema,
  preferredContactMethod: NullableContactMethodSchema,
  priority: NullablePrioritySchema,
  notes: NullableStringSchema,
  linkedinUrl: NullableStringSchema,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  lastInteractionSummary: NullableStringSchema,
  interactionHistory: Type.Array(InteractionSchema),
});

type Contact = Static<typeof ContactSchema>;

const CreateContactBodySchema = Type.Object({
  firstName: Type.String({ minLength: 1, maxLength: 100 }),
  lastName: Type.String({ minLength: 1, maxLength: 100 }),
  birthdate: Type.Optional(Type.String({ format: 'date' })),
  lastContactedAt: Type.Optional(Type.String({ format: 'date' })),
  nextContactAt: Type.Optional(Type.String({ format: 'date' })),
  connectionTypes: Type.Optional(
    Type.Array(ConnectionTypeSchema, { uniqueItems: true, maxItems: connectionOptions.length }),
  ),
  company: Type.Optional(Type.String({ maxLength: 120 })),
  title: Type.Optional(Type.String({ maxLength: 120 })),
  email: Type.Optional(Type.String({ format: 'email' })),
  phone: Type.Optional(Type.String({ maxLength: 40 })),
  location: Type.Optional(Type.String({ maxLength: 120 })),
  preferredContactMethod: Type.Optional(ContactMethodSchema),
  priority: Type.Optional(PrioritySchema),
  notes: Type.Optional(Type.String({ maxLength: 2000 })),
  lastInteractionSummary: Type.Optional(Type.String({ maxLength: 280 })),
  linkedinUrl: Type.Optional(Type.String({ format: 'uri' })),
});

type CreateContactBody = Static<typeof CreateContactBodySchema>;

const UpdateContactBodySchema = Type.Object({
  firstName: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  lastName: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  birthdate: Type.Optional(NullableDateSchema),
  lastContactedAt: Type.Optional(NullableDateSchema),
  nextContactAt: Type.Optional(NullableDateSchema),
  connectionTypes: Type.Optional(
    Type.Array(ConnectionTypeSchema, { uniqueItems: true, maxItems: connectionOptions.length }),
  ),
  company: Type.Optional(NullableStringSchema),
  title: Type.Optional(NullableStringSchema),
  email: Type.Optional(NullableEmailSchema),
  phone: Type.Optional(NullableStringSchema),
  location: Type.Optional(NullableStringSchema),
  preferredContactMethod: Type.Optional(NullableContactMethodSchema),
  priority: Type.Optional(NullablePrioritySchema),
  notes: Type.Optional(NullableStringSchema),
  lastInteractionSummary: Type.Optional(NullableStringSchema),
  linkedinUrl: Type.Optional(NullableStringSchema),
});

type UpdateContactBody = Static<typeof UpdateContactBodySchema>;

const ContactListResponseSchema = Type.Object({
  items: Type.Array(ContactSchema),
  summary: Type.Object({
    total: Type.Number(),
    overdue: Type.Number(),
    dueThisWeek: Type.Number(),
    upcomingBirthdays: Type.Number(),
  }),
});

type ContactListResponse = Static<typeof ContactListResponseSchema>;

const ContactParamsSchema = Type.Object({
  contactId: Type.String(),
});

type ContactParams = Static<typeof ContactParamsSchema>;

const LogInteractionBodySchema = Type.Object({
  interactionDate: Type.String({ format: 'date' }),
  nextContactAt: Type.Optional(Type.String({ format: 'date' })),
  summary: Type.Optional(Type.String({ maxLength: 280 })),
});

type LogInteractionBody = Static<typeof LogInteractionBodySchema>;

const InteractionMutationResponseSchema = Type.Object({
  interaction: InteractionSchema,
  contact: ContactSchema,
});

type InteractionMutationResponse = Static<typeof InteractionMutationResponseSchema>;

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string | null;
  last_contacted_at: string | null;
  next_contact_at: string | null;
  connection_types: string;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  preferred_contact_method: ContactMethod | null;
  priority: Priority | null;
  notes: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
  last_interaction_summary: string | null;
};

type InteractionRow = {
  id: string;
  contact_id: string;
  interaction_date: string;
  summary: string | null;
  next_contact_at: string | null;
  next_contact_source: NextContactSource;
  suggested_cadence_days: number | null;
  created_at: string;
};

type NextTouchpoint = {
  nextContactAt: string | null;
  nextContactSource: NextContactSource;
  suggestedCadenceDays: number | null;
};

function optionalText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeConnectionTypes(values?: ConnectionType[]): ConnectionType[] {
  return [...new Set(values ?? [])].sort();
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function daysFromNow(days: number): Date {
  const base = startOfToday();
  base.setDate(base.getDate() + days);
  return base;
}

function isDateInRange(value: string | null, start: Date, end: Date): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return date >= start && date <= end;
}

function isOverdue(value: string | null, reference: Date): boolean {
  if (!value) {
    return false;
  }

  return new Date(`${value}T00:00:00`) < reference;
}

function isBirthdayUpcoming(value: string | null, reference: Date, horizonDays: number): boolean {
  if (!value) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const month = parsed.getUTCMonth();
  const day = parsed.getUTCDate();
  const currentYear = reference.getUTCFullYear();
  const birthdayThisYear = new Date(Date.UTC(currentYear, month, day));
  const birthdayNextYear = new Date(Date.UTC(currentYear + 1, month, day));
  const windowEnd = new Date(reference);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + horizonDays);

  return (
    (birthdayThisYear >= reference && birthdayThisYear <= windowEnd) ||
    (birthdayNextYear >= reference && birthdayNextYear <= windowEnd)
  );
}

function sortContacts(items: Contact[]): Contact[] {
  return [...items].sort((left, right) => {
    const leftNext = left.nextContactAt ?? '9999-12-31';
    const rightNext = right.nextContactAt ?? '9999-12-31';

    if (leftNext !== rightNext) {
      return leftNext.localeCompare(rightNext);
    }

    return left.fullName.localeCompare(right.fullName);
  });
}

function buildContactSummary(items: Contact[]): ContactListResponse['summary'] {
  const today = startOfToday();
  const thisWeek = daysFromNow(7);
  const birthdayWindowStart = new Date();

  return {
    total: items.length,
    overdue: items.filter((item) => isOverdue(item.nextContactAt, today)).length,
    dueThisWeek: items.filter((item) => isDateInRange(item.nextContactAt, today, thisWeek)).length,
    upcomingBirthdays: items.filter((item) =>
      isBirthdayUpcoming(item.birthdate, birthdayWindowStart, 30),
    ).length,
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function addDaysToDateString(value: string, days: number): string {
  const [year, month, day] = value.split('-').map((segment) => Number.parseInt(segment, 10));
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date string: ${value}`);
  }

  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

function suggestCadenceDays(connectionTypes: ConnectionType[], priority: Nullable<Priority>): number {
  const baseCandidates = [45];

  if (
    connectionTypes.includes('customer') ||
    connectionTypes.includes('business partner')
  ) {
    baseCandidates.push(21);
  }

  if (connectionTypes.includes('networking acquaintance')) {
    baseCandidates.push(30);
  }

  if (connectionTypes.includes('friend') || connectionTypes.includes('family friend')) {
    baseCandidates.push(60);
  }

  let cadence = Math.min(...baseCandidates);

  if (priority === 'high') {
    cadence = Math.min(cadence, 14);
  } else if (priority === 'low') {
    cadence = Math.max(cadence, 60);
  }

  return cadence;
}

function resolveNextTouchpoint(
  anchorDate: string,
  manualNextContactAt: string | undefined,
  connectionTypes: ConnectionType[],
  priority: Nullable<Priority>,
): NextTouchpoint {
  if (manualNextContactAt) {
    return {
      nextContactAt: manualNextContactAt,
      nextContactSource: 'manual',
      suggestedCadenceDays: null,
    };
  }

  const suggestedCadenceDays = suggestCadenceDays(connectionTypes, priority);
  return {
    nextContactAt: addDaysToDateString(anchorDate, suggestedCadenceDays),
    nextContactSource: 'suggested',
    suggestedCadenceDays,
  };
}

function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_PATH?.trim();
  return resolve(configured && configured.length > 0 ? configured : 'data/crm.sqlite');
}

function initDatabase(databasePath: string): DatabaseSync {
  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      birthdate TEXT,
      last_contacted_at TEXT,
      next_contact_at TEXT,
      connection_types TEXT NOT NULL,
      company TEXT,
      title TEXT,
      email TEXT,
      phone TEXT,
      location TEXT,
      preferred_contact_method TEXT,
      priority TEXT,
      notes TEXT,
      linkedin_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_interaction_summary TEXT
    );

    CREATE TABLE IF NOT EXISTS contact_interactions (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      interaction_date TEXT NOT NULL,
      summary TEXT,
      next_contact_at TEXT,
      next_contact_source TEXT NOT NULL,
      suggested_cadence_days INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS contacts_next_contact_at_idx
      ON contacts(next_contact_at);

    CREATE INDEX IF NOT EXISTS contact_interactions_contact_id_idx
      ON contact_interactions(contact_id, interaction_date DESC, created_at DESC);
  `);

  try {
    database.exec("ALTER TABLE contacts ADD COLUMN linkedin_url TEXT;");
  } catch {
    // Column might already exist
  }

  return database;
}

function parseConnectionTypes(serialized: string): ConnectionType[] {
  const parsed = JSON.parse(serialized) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((value): value is ConnectionType =>
    connectionOptions.includes(value as ConnectionType),
  );
}

function mapInteractionRow(row: InteractionRow): Interaction {
  return {
    id: row.id,
    contactId: row.contact_id,
    interactionDate: row.interaction_date,
    summary: row.summary,
    nextContactAt: row.next_contact_at,
    nextContactSource: row.next_contact_source,
    suggestedCadenceDays: row.suggested_cadence_days,
    createdAt: row.created_at,
  };
}

function mapContactRow(row: ContactRow, interactions: Interaction[]): Contact {
  const firstName = row.first_name;
  const lastName = row.last_name;

  return {
    id: row.id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    birthdate: row.birthdate,
    lastContactedAt: row.last_contacted_at,
    nextContactAt: row.next_contact_at,
    connectionTypes: parseConnectionTypes(row.connection_types),
    company: row.company,
    title: row.title,
    email: row.email,
    phone: row.phone,
    location: row.location,
    preferredContactMethod: row.preferred_contact_method,
    priority: row.priority,
    notes: row.notes,
    linkedinUrl: row.linkedin_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastInteractionSummary: row.last_interaction_summary,
    interactionHistory: interactions,
  };
}

function getInteractionsForContact(database: DatabaseSync, contactId: string): Interaction[] {
  const rows = database
    .prepare(
      `
        SELECT
          id,
          contact_id,
          interaction_date,
          summary,
          next_contact_at,
          next_contact_source,
          suggested_cadence_days,
          created_at
        FROM contact_interactions
        WHERE contact_id = ?
        ORDER BY interaction_date DESC, created_at DESC
      `,
    )
    .all(contactId) as InteractionRow[];

  return rows.map(mapInteractionRow);
}

function listContacts(database: DatabaseSync): Contact[] {
  const rows = database
    .prepare(
      `
        SELECT
          id,
          first_name,
          last_name,
          birthdate,
          last_contacted_at,
          next_contact_at,
          connection_types,
          company,
          title,
          email,
          phone,
          location,
          preferred_contact_method,
          priority,
          notes,
          linkedin_url,
          created_at,
          updated_at,
          last_interaction_summary
        FROM contacts
        ORDER BY COALESCE(next_contact_at, '9999-12-31') ASC, first_name ASC, last_name ASC
      `,
    )
    .all() as ContactRow[];

  return rows.map((row) => mapContactRow(row, getInteractionsForContact(database, row.id)));
}

function getContact(database: DatabaseSync, contactId: string): Contact | null {
  const row = database
    .prepare(
      `
        SELECT
          id,
          first_name,
          last_name,
          birthdate,
          last_contacted_at,
          next_contact_at,
          connection_types,
          company,
          title,
          email,
          phone,
          location,
          preferred_contact_method,
          priority,
          notes,
          linkedin_url,
          created_at,
          updated_at,
          last_interaction_summary
        FROM contacts
        WHERE id = ?
      `,
    )
    .get(contactId) as ContactRow | undefined;

  if (!row) {
    return null;
  }

  return mapContactRow(row, getInteractionsForContact(database, row.id));
}

function getInteraction(database: DatabaseSync, interactionId: string): Interaction | null {
  const row = database
    .prepare(
      `
        SELECT
          id,
          contact_id,
          interaction_date,
          summary,
          next_contact_at,
          next_contact_source,
          suggested_cadence_days,
          created_at
        FROM contact_interactions
        WHERE id = ?
      `,
    )
    .get(interactionId) as InteractionRow | undefined;

  return row ? mapInteractionRow(row) : null;
}

function createContact(database: DatabaseSync, body: CreateContactBody): Contact {
  const id = generateId('contact');
  const now = new Date().toISOString();
  const firstName = body.firstName.trim();
  const lastName = body.lastName.trim();
  const connectionTypes = normalizeConnectionTypes(body.connectionTypes);
  const lastInteractionSummary = optionalText(body.lastInteractionSummary);

  const nextTouchpoint =
    body.lastContactedAt !== undefined
      ? resolveNextTouchpoint(
          body.lastContactedAt,
          body.nextContactAt,
          connectionTypes,
          body.priority ?? null,
        )
      : {
          nextContactAt: body.nextContactAt ?? null,
          nextContactSource: 'manual' as const,
          suggestedCadenceDays: null,
        };

  database
    .prepare(
      `
        INSERT INTO contacts (
          id,
          first_name,
          last_name,
          birthdate,
          last_contacted_at,
          next_contact_at,
          connection_types,
          company,
          title,
          email,
          phone,
          location,
          preferred_contact_method,
          priority,
          notes,
          linkedin_url,
          created_at,
          updated_at,
          last_interaction_summary
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      id,
      firstName,
      lastName,
      body.birthdate ?? null,
      body.lastContactedAt ?? null,
      nextTouchpoint.nextContactAt,
      JSON.stringify(connectionTypes),
      optionalText(body.company),
      optionalText(body.title),
      optionalText(body.email),
      optionalText(body.phone),
      optionalText(body.location),
      body.preferredContactMethod ?? null,
      body.priority ?? null,
      optionalText(body.notes),
      optionalText(body.linkedinUrl),
      now,
      now,
      lastInteractionSummary,
    );

  if (body.lastContactedAt) {
    database
      .prepare(
        `
          INSERT INTO contact_interactions (
            id,
            contact_id,
            interaction_date,
            summary,
            next_contact_at,
            next_contact_source,
            suggested_cadence_days,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        generateId('interaction'),
        id,
        body.lastContactedAt,
        lastInteractionSummary,
        nextTouchpoint.nextContactAt,
        nextTouchpoint.nextContactSource,
        nextTouchpoint.suggestedCadenceDays,
        now,
      );
  }

  const created = getContact(database, id);
  if (!created) {
    throw new Error('Contact could not be loaded after creation.');
  }

  return created;
}

function updateContact(
  database: DatabaseSync,
  contactId: string,
  body: UpdateContactBody,
): Contact | null {
  const current = getContact(database, contactId);
  if (!current) {
    return null;
  }

  const now = new Date().toISOString();
  const updated = {
    firstName: body.firstName?.trim() ?? current.firstName,
    lastName: body.lastName?.trim() ?? current.lastName,
    birthdate: body.birthdate === undefined ? current.birthdate : body.birthdate,
    lastContactedAt:
      body.lastContactedAt === undefined ? current.lastContactedAt : body.lastContactedAt,
    nextContactAt: body.nextContactAt === undefined ? current.nextContactAt : body.nextContactAt,
    connectionTypes:
      body.connectionTypes === undefined
        ? current.connectionTypes
        : normalizeConnectionTypes(body.connectionTypes),
    company: body.company === undefined ? current.company : optionalText(body.company),
    title: body.title === undefined ? current.title : optionalText(body.title),
    email: body.email === undefined ? current.email : optionalText(body.email),
    phone: body.phone === undefined ? current.phone : optionalText(body.phone),
    location: body.location === undefined ? current.location : optionalText(body.location),
    preferredContactMethod:
      body.preferredContactMethod === undefined
        ? current.preferredContactMethod
        : body.preferredContactMethod,
    priority: body.priority === undefined ? current.priority : body.priority,
    notes: body.notes === undefined ? current.notes : optionalText(body.notes),
    lastInteractionSummary:
      body.lastInteractionSummary === undefined
        ? current.lastInteractionSummary
        : optionalText(body.lastInteractionSummary),
    linkedinUrl: body.linkedinUrl === undefined ? current.linkedinUrl : optionalText(body.linkedinUrl),
  };

  database
    .prepare(
      `
        UPDATE contacts
        SET
          first_name = ?,
          last_name = ?,
          birthdate = ?,
          last_contacted_at = ?,
          next_contact_at = ?,
          connection_types = ?,
          company = ?,
          title = ?,
          email = ?,
          phone = ?,
          location = ?,
          preferred_contact_method = ?,
          priority = ?,
          notes = ?,
          linkedin_url = ?,
          updated_at = ?,
          last_interaction_summary = ?
        WHERE id = ?
      `,
    )
    .run(
      updated.firstName,
      updated.lastName,
      updated.birthdate,
      updated.lastContactedAt,
      updated.nextContactAt,
      JSON.stringify(updated.connectionTypes),
      updated.company,
      updated.title,
      updated.email,
      updated.phone,
      updated.location,
      updated.preferredContactMethod,
      updated.priority,
      updated.notes,
      updated.linkedinUrl,
      now,
      updated.lastInteractionSummary,
      contactId,
    );

  return getContact(database, contactId);
}

function deleteContact(database: DatabaseSync, contactId: string): boolean {
  const result = database.prepare(`DELETE FROM contacts WHERE id = ?`).run(contactId);
  return Number(result.changes) > 0;
}

function logInteraction(
  database: DatabaseSync,
  contactId: string,
  body: LogInteractionBody,
): InteractionMutationResponse | null {
  const contact = getContact(database, contactId);
  if (!contact) {
    return null;
  }

  const now = new Date().toISOString();
  const interactionId = generateId('interaction');
  const nextTouchpoint = resolveNextTouchpoint(
    body.interactionDate,
    body.nextContactAt,
    contact.connectionTypes,
    contact.priority,
  );
  const summary = optionalText(body.summary);

  database
    .prepare(
      `
        INSERT INTO contact_interactions (
          id,
          contact_id,
          interaction_date,
          summary,
          next_contact_at,
          next_contact_source,
          suggested_cadence_days,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      interactionId,
      contactId,
      body.interactionDate,
      summary,
      nextTouchpoint.nextContactAt,
      nextTouchpoint.nextContactSource,
      nextTouchpoint.suggestedCadenceDays,
      now,
    );

  const shouldPromoteToCurrent =
    contact.lastContactedAt === null || body.interactionDate >= contact.lastContactedAt;

  if (shouldPromoteToCurrent) {
    database
      .prepare(
        `
          UPDATE contacts
          SET
            last_contacted_at = ?,
            next_contact_at = ?,
            last_interaction_summary = ?,
            updated_at = ?
          WHERE id = ?
        `,
      )
      .run(
        body.interactionDate,
        nextTouchpoint.nextContactAt,
        summary ?? contact.lastInteractionSummary,
        now,
        contactId,
      );
  } else {
    database
      .prepare(
        `
          UPDATE contacts
          SET updated_at = ?
          WHERE id = ?
        `,
      )
      .run(now, contactId);
  }

  const interaction = getInteraction(database, interactionId);
  const updatedContact = getContact(database, contactId);

  if (!interaction || !updatedContact) {
    throw new Error('Interaction could not be loaded after creation.');
  }

  return {
    interaction,
    contact: updatedContact,
  };
}

export function buildApp() {
  const database = initDatabase(resolveDatabasePath());

  const app = Fastify({
    logger: true,
  });

  app.addHook('onClose', async () => {
    database.close();
  });

  void app.register(swagger, {
    openapi: {
      info: {
        title: 'Personal CRM Starter',
        version: '0.4.0',
        description:
          'A lightweight TypeScript CRM with a clean frontend, persistent SQLite storage, interaction history, and editable contact detail views.',
      },
    },
  });

  void app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  app.get('/', async (_request, reply) => {
    return reply.type('text/html; charset=utf-8').send(renderCrmPage());
  });

  app.get<{ Reply: ApiIndexResponse }>(
    '/api',
    {
      schema: {
        tags: ['meta'],
        response: {
          200: ApiIndexResponseSchema,
        },
      },
    },
    async () => {
      return {
        name: 'personal-crm-starter',
        product: 'Relationship CRM',
        docs: '/docs',
        openapi: '/openapi.json',
        contacts: '/api/contacts',
      };
    },
  );

  app.get<{ Reply: ContactListResponse }>(
    '/api/contacts',
    {
      schema: {
        tags: ['contacts'],
        response: {
          200: ContactListResponseSchema,
        },
      },
    },
    async () => {
      const items = sortContacts(listContacts(database));

      return {
        items,
        summary: buildContactSummary(items),
      };
    },
  );

  app.get<{ Params: ContactParams; Reply: Contact }>(
    '/api/contacts/:contactId',
    {
      schema: {
        tags: ['contacts'],
        params: ContactParamsSchema,
        response: {
          200: ContactSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const contact = getContact(database, request.params.contactId);

      if (!contact) {
        return reply.code(404).send({ message: 'Contact not found' } as never);
      }

      return contact;
    },
  );

  app.post<{ Body: CreateContactBody; Reply: Contact }>(
    '/api/contacts',
    {
      schema: {
        tags: ['contacts'],
        body: CreateContactBodySchema,
        response: {
          201: ContactSchema,
        },
      },
    },
    async (request, reply) => {
      const contact = createContact(database, request.body);
      return reply.code(201).send(contact);
    },
  );

  app.patch<{ Params: ContactParams; Body: UpdateContactBody; Reply: Contact }>(
    '/api/contacts/:contactId',
    {
      schema: {
        tags: ['contacts'],
        params: ContactParamsSchema,
        body: UpdateContactBodySchema,
        response: {
          200: ContactSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const contact = updateContact(database, request.params.contactId, request.body);

      if (!contact) {
        return reply.code(404).send({ message: 'Contact not found' } as never);
      }

      return contact;
    },
  );

  app.delete<{ Params: ContactParams }>(
    '/api/contacts/:contactId',
    {
      schema: {
        tags: ['contacts'],
        params: ContactParamsSchema,
        response: {
          204: Type.Null(),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const deleted = deleteContact(database, request.params.contactId);

      if (!deleted) {
        return reply.code(404).send({ message: 'Contact not found' } as never);
      }

      return reply.code(204).send();
    },
  );

  app.post<{
    Params: ContactParams;
    Body: LogInteractionBody;
    Reply: InteractionMutationResponse;
  }>(
    '/api/contacts/:contactId/interactions',
    {
      schema: {
        tags: ['contacts'],
        params: ContactParamsSchema,
        body: LogInteractionBodySchema,
        response: {
          201: InteractionMutationResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = logInteraction(database, request.params.contactId, request.body);

      if (!result) {
        return reply.code(404).send({ message: 'Contact not found' } as never);
      }

      return reply.code(201).send(result);
    },
  );

  app.get<{ Reply: OpenApiResponse }>(
    '/openapi.json',
    {
      schema: {
        tags: ['meta'],
        response: {
          200: OpenApiResponseSchema,
        },
      },
    },
    async () => {
      return app.swagger() as OpenApiResponse;
    },
  );

  app.get<{ Reply: HealthResponse }>(
    '/health',
    {
      schema: {
        tags: ['health'],
        response: {
          200: HealthResponseSchema,
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        service: 'personal-crm-starter',
        timestamp: new Date().toISOString(),
      };
    },
  );

  return app;
}
