import { z } from "zod";
import { crmTool } from "@/server/everyapp/crm-tool";
import { EnrichmentService } from "@/server/features/enrichment/services/EnrichmentService";
import { ENRICHMENT_PROVIDERS, ENRICHMENT_RUN_SIZE } from "@/shared/enrichment";

const idsInput = z
  .object({
    ids: z
      .array(z.string())
      .min(1)
      .max(ENRICHMENT_RUN_SIZE)
      .describe("Record ids to look up, at most five at a time."),
  })
  .strict();

const runOutput = z.object({
  provider: z.enum(ENRICHMENT_PROVIDERS),
  results: z.array(
    z.object({
      id: z.string(),
      outcome: z.enum(["enriched", "nothing", "skipped", "failed"]),
      reason: z.string().nullable(),
    }),
  ),
});

export const enrichmentTools = {
  enrich_contacts: crmTool({
    description:
      "Look up the selected contacts with the workspace's enrichment provider and fill in blanks. Existing values are left alone.",
    risk: "write",
    input: idsInput,
    output: runOutput,
    handler: ({ ids }, context) =>
      EnrichmentService.enrichContacts(context, ids),
  }),

  enrich_companies: crmTool({
    description:
      "Look up the selected companies with the workspace's enrichment provider and fill in blanks. Existing values are left alone.",
    risk: "write",
    input: idsInput,
    output: runOutput,
    handler: ({ ids }, context) =>
      EnrichmentService.enrichCompanies(context, ids),
  }),
};
