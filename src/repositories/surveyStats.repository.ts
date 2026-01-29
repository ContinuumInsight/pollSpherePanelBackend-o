import SurveyStats, { type ISurveyStats, type ISurveyStatsCounters } from '../models/SurveyStats';

export type SurveyStatsField = keyof ISurveyStatsCounters;

const baseUpsertOptions = {
  upsert: true,
  new: true,
} as const;

const nowSet = () => ({ last_updated: new Date() });

export const surveyStatsRepository = {
  async incrementOverall(surveyId: string, field: SurveyStatsField): Promise<void> {
    await SurveyStats.findOneAndUpdate(
      { survey_id: surveyId, country: null, vendor_id: null },
      {
        $inc: { [`stats.${field}`]: 1 },
        $set: nowSet(),
      },
      baseUpsertOptions
    );
  },

  async incrementCountry(surveyId: string, country: string, field: SurveyStatsField): Promise<void> {
    await SurveyStats.findOneAndUpdate(
      { survey_id: surveyId, country, vendor_id: null },
      {
        $inc: { [`stats.${field}`]: 1 },
        $set: nowSet(),
      },
      baseUpsertOptions
    );
  },

  async incrementVendor(
    surveyId: string,
    country: string,
    vendorId: string,
    field: SurveyStatsField
  ): Promise<void> {
    await SurveyStats.findOneAndUpdate(
      { survey_id: surveyId, country, vendor_id: vendorId },
      {
        $inc: { [`stats.${field}`]: 1 },
        $set: nowSet(),
      },
      baseUpsertOptions
    );
  },

  async getBreakdown(surveyId: string): Promise<{
    overall: ISurveyStats | null;
    countries: ISurveyStats[];
    vendors: ISurveyStats[];
  }> {
    const docs = await SurveyStats.find({ survey_id: surveyId }).sort({ country: 1, vendor_id: 1 });

    const overall = docs.find((d) => d.country === null && d.vendor_id === null) || null;
    const countries = docs.filter((d) => d.country !== null && d.vendor_id === null);
    const vendors = docs.filter((d) => d.country !== null && d.vendor_id !== null);

    return { overall, countries, vendors };
  },

  async deleteBySurveyId(surveyId: string): Promise<void> {
    await SurveyStats.deleteMany({ survey_id: surveyId });
  },

  // Update stats at all three levels (overall, country, vendor) in one call
  async updateAllLevels(
    surveyId: string,
    country: string | null,
    vendorId: string | null,
    field: SurveyStatsField
  ): Promise<{ success: boolean; errors: string[] }> {
    const statsErrors: string[] = [];

    // 1. Overall stats (always update)
    try {
      await this.incrementOverall(surveyId, field);
      console.log(`✅ Updated overall stats for survey: ${surveyId}, status: ${field}`);
    } catch (err: any) {
      const error = `Failed to update overall stats: ${err.message}`;
      console.error(`❌ ${error}`);
      statsErrors.push(error);
    }

    // 2. Country level stats (if country provided)
    if (country) {
      try {
        await this.incrementCountry(surveyId, country, field);
        console.log(`✅ Updated country stats for survey: ${surveyId}, country: ${country}, status: ${field}`);
      } catch (err: any) {
        const error = `Failed to update country stats: ${err.message}`;
        console.error(`❌ ${error}`);
        statsErrors.push(error);
      }
    }

    // 3. Vendor level stats (if country and vendorId provided)
    if (country && vendorId) {
      try {
        await this.incrementVendor(surveyId, country, vendorId, field);
        console.log(`✅ Updated vendor stats for survey: ${surveyId}, country: ${country}, vendor: ${vendorId}, status: ${field}`);
      } catch (err: any) {
        const error = `Failed to update vendor stats: ${err.message}`;
        console.error(`❌ ${error}`);
        statsErrors.push(error);
      }
    }

    return {
      success: statsErrors.length === 0,
      errors: statsErrors,
    };
  },
};
