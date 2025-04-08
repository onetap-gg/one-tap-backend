import { Dao } from "../../Classes/Dao";

type StartEndPair = {
  start: string;
  end: string;
};

interface IVallorent {
  checkIfReqMeet: (
    userAchievement: VallorentUserData,
    goals: VallorentUptoDateData
  ) => { isCompleted: boolean; percentage: number };
  updateMatchDetails: (
    matchData: VallorentUserData,
    userId: string
  ) => Promise<VallorentUptoDateDataArray>;
  getDataUptoDate: (
    startEndPairs: { startTime: string; endTime: string }[],
    userId: string
  ) => Promise<VallorentUptoDateDataArray>;
  calculateTotal: (
    matches: VallorentUptoDateDataArray,
    challenge: VallorentUptoDateData
  ) => VallorentUptoDateData;
  uploadChallenges: (data: any) => Promise<void>;
  uploadProgress: (data: UploadProgress) => Promise<any>;
  getProgressData: (userId: string) => Promise<any>;
  upsertProgress: (progress: UpsertData) => Promise<any>;
  editChallenge: (data: UpsertData, id: string) => Promise<any>;
}
type UpsertData = Array<{
  requirement: VallorentUserData;
  userId: string;
  challengeId: string;
  isCompleted: boolean;
}>;

type UploadProgress = Array<{
  requirement: VallorentUserData;
  userId: string;
  challengeId: string;
  isCompleted?: boolean;
}>;
type progress = {
  requirement: VallorentUserData;
  userId: string;
  challengeId: string;
  isCompleted: boolean;
};

type UpsertProgress = Array<{
  requirement: VallorentUserData;
  userId: string;
  challengeId: string;
  id: string;
  isCompleted: string;
}>;

export type VallorentUptoDateDataArray =
  | {
      id: number;
      match_start: string;
      match_end: string;
      total_kills: number;
      deaths: number;
      assists: number;
      headshot: number;
      spikes_planted: number;
      spikes_defuse: number;
      damage_done: number;
      team_scores: number;
      match_status: boolean;
      agent: string;
      region: string;
      game_mode: string;
      damage_taken: number;
      userId: string;
    }[]
  | null;

export type VallorentUptoDateData = {
  id: number;
  match_start: string;
  match_end: string;
  total_kills: number;
  deaths: number;
  assists: number;
  headshot: number;
  spikes_planted: number;
  spikes_defuse: number;
  damage_done: number;
  team_scores: number;
  match_status: boolean;
  agent: string;
  region: string;
  game_mode: string;
  damage_taken: number;
  userId: string;
};

export type VallorentUserData = {
  match_start: string;
  match_end: string;
  total_kills: number;
  deaths: number;
  assists: number;
  headshot: number;
  spikes_planted: number;
  spikes_defuse: number;
  damage_done: number;
  team_scores: number;
  match_status: boolean;
  agent: string;
  region: string;
  game_mode: string;
  damage_taken: number;
};

class Vallorent extends Dao implements IVallorent {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  checkIfReqMeet(
    userAchievement: VallorentUserData,
    goal: VallorentUptoDateData
  ) {
    console.log(
      "\n================================================================="
    );
    console.log("🎯 CHALLENGE REQUIREMENT CHECK");
    console.log(
      "================================================================="
    );

    if (userAchievement === null) {
      console.error("❌ Error: User achievement data is null");
      this.throwError("Null object");
    }

    console.log("\n📊 User Achievement Data:");
    console.log(JSON.stringify(userAchievement, null, 2));
    console.log("\n🎯 Challenge Goal Data:");
    console.log(JSON.stringify(goal, null, 2));

    let achieved = 0;
    let totalChecks = 0;

    // Default values object
    const defaultValues = {
      total_kills: 0,
      deaths: 0,
      assists: 0,
      headshot: 0,
      spikes_defuse: 0,
      spikes_planted: 0,
      damage_done: 0,
      team_scores: 0,
      damage_taken: 0,
      agent: "",
      region: "",
      game_mode: "",
      match_status: false,
    };

    console.log("\n📋 Default Values Reference:");
    console.log(JSON.stringify(defaultValues, null, 2));
    console.log("\n🔍 Starting Requirement Checks...");

    // Only check metrics that are different from default values
    if (goal.total_kills !== defaultValues.total_kills) {
      totalChecks++;
      console.log("\n⚔️ Checking Total Kills:");
      console.log(`Required: ${goal.total_kills}`);
      console.log(`Achieved: ${userAchievement.total_kills}`);
      if (userAchievement.total_kills >= goal.total_kills) {
        achieved++;
        console.log("✅ Total kills requirement met!");
      } else {
        console.log("❌ Total kills requirement not met");
      }
    }
    if (goal.deaths !== defaultValues.deaths) {
      totalChecks++;
      console.log(
        `Checking deaths: User has ${userAchievement.deaths}, need ${goal.deaths}`
      );
      if (userAchievement.deaths >= goal.deaths) {
        achieved++;
        console.log("✓ Deaths requirement met!");
      } else {
        console.log("✗ Deaths requirement not met");
      }
    }
    if (goal.assists !== defaultValues.assists) {
      totalChecks++;
      console.log(
        `Checking assists: User has ${userAchievement.assists}, need ${goal.assists}`
      );
      if (userAchievement.assists >= goal.assists) {
        achieved++;
        console.log("✓ Assists requirement met!");
      } else {
        console.log("✗ Assists requirement not met");
      }
    }
    if (goal.headshot !== defaultValues.headshot) {
      totalChecks++;
      console.log(
        `Checking headshots: User has ${userAchievement.headshot}, need ${goal.headshot}`
      );
      if (userAchievement.headshot >= goal.headshot) {
        achieved++;
        console.log("✓ Headshots requirement met!");
      } else {
        console.log("✗ Headshots requirement not met");
      }
    }
    if (goal.spikes_defuse !== defaultValues.spikes_defuse) {
      totalChecks++;
      console.log(
        `Checking spike defuses: User has ${userAchievement.spikes_defuse}, need ${goal.spikes_defuse}`
      );
      if (userAchievement.spikes_defuse >= goal.spikes_defuse) {
        achieved++;
        console.log("✓ Spike defuses requirement met!");
      } else {
        console.log("✗ Spike defuses requirement not met");
      }
    }
    if (goal.spikes_planted !== defaultValues.spikes_planted) {
      totalChecks++;
      console.log(
        `Checking spikes planted: User has ${userAchievement.spikes_planted}, need ${goal.spikes_planted}`
      );
      if (userAchievement.spikes_planted >= goal.spikes_planted) {
        achieved++;
        console.log("✓ Spikes planted requirement met!");
      } else {
        console.log("✗ Spikes planted requirement not met");
      }
    }
    if (goal.damage_done !== defaultValues.damage_done) {
      totalChecks++;
      console.log(
        `Checking damage done: User has ${userAchievement.damage_done}, need ${goal.damage_done}`
      );
      if (userAchievement.damage_done >= goal.damage_done) {
        achieved++;
        console.log("✓ Damage done requirement met!");
      } else {
        console.log("✗ Damage done requirement not met");
      }
    }
    if (goal.team_scores !== defaultValues.team_scores) {
      totalChecks++;
      console.log(
        `Checking team scores: User has ${userAchievement.team_scores}, need ${goal.team_scores}`
      );
      if (userAchievement.team_scores >= goal.team_scores) {
        achieved++;
        console.log("✓ Team scores requirement met!");
      } else {
        console.log("✗ Team scores requirement not met");
      }
    }
    if (goal.damage_taken !== defaultValues.damage_taken) {
      totalChecks++;
      console.log(
        `Checking damage taken: User has ${userAchievement.damage_taken}, need ${goal.damage_taken}`
      );
      if (userAchievement.damage_taken >= goal.damage_taken) {
        achieved++;
        console.log("✓ Damage taken requirement met!");
      } else {
        console.log("✗ Damage taken requirement not met");
      }
    }

    // Calculate percentage based on actual requirements
    let total = 0;
    let player = 0;

    if (goal.total_kills !== defaultValues.total_kills) {
      total += goal.total_kills;
      player += Math.min(userAchievement.total_kills, goal.total_kills);
    }
    if (goal.deaths !== defaultValues.deaths) {
      total += goal.deaths;
      player += Math.min(userAchievement.deaths, goal.deaths);
    }
    if (goal.assists !== defaultValues.assists) {
      total += goal.assists;
      player += Math.min(userAchievement.assists, goal.assists);
    }
    if (goal.headshot !== defaultValues.headshot) {
      total += goal.headshot;
      player += Math.min(userAchievement.headshot, goal.headshot);
    }
    if (goal.spikes_defuse !== defaultValues.spikes_defuse) {
      total += goal.spikes_defuse;
      player += Math.min(userAchievement.spikes_defuse, goal.spikes_defuse);
    }
    if (goal.spikes_planted !== defaultValues.spikes_planted) {
      total += goal.spikes_planted;
      player += Math.min(userAchievement.spikes_planted, goal.spikes_planted);
    }
    if (goal.damage_done !== defaultValues.damage_done) {
      total += goal.damage_done;
      player += Math.min(userAchievement.damage_done, goal.damage_done);
    }
    if (goal.team_scores !== defaultValues.team_scores) {
      total += goal.team_scores;
      player += Math.min(userAchievement.team_scores, goal.team_scores);
    }
    if (goal.damage_taken !== defaultValues.damage_taken) {
      total += goal.damage_taken;
      player += Math.min(userAchievement.damage_taken, goal.damage_taken);
    }

    let percentage = total > 0 ? (player / total) * 100 : 100;
    let isCompleted = totalChecks === 0 || achieved === totalChecks;

    console.log("\n📈 Challenge Summary:");
    console.log(`Total requirements to check: ${totalChecks}`);
    console.log(`Requirements achieved: ${achieved}`);
    console.log(
      `Completion status: ${isCompleted ? "✅ COMPLETED" : "❌ NOT COMPLETED"}`
    );
    console.log(`Progress: ${percentage.toFixed(2)}%`);
    console.log(
      "=================================================================\n"
    );

    return { isCompleted, percentage };
  }

  async updateMatchDetails(matchData: VallorentUserData, userId: string) {
    const { data, error } = await this.dbInstance!.from("valorent_data")
      .insert({ ...matchData, userId })
      .select();
    return data;
    if (error) this.throwError(error);
  }

  async getDataUptoDate(
    startEndPairs: { startTime: string; endTime: string }[],
    userId: string
  ) {
    console.log("Fetching data for:", startEndPairs, userId);

    if (startEndPairs.length === 0) {
      return [];
    }

    // Create a query to get matches within any of the time ranges
    const { data, error } = await this.dbInstance!.from("valorent_data")
      .select(
        `id, match_start, match_end, total_kills, deaths, assists, headshot, 
        spikes_planted, spikes_defuse, damage_done, team_scores, match_status, 
        agent, region, game_mode, damage_taken, userId`
      )
      .eq("userId", userId)
      .or(
        startEndPairs
          .map(
            (pair) =>
              `and(match_start.gte.${pair.startTime},match_end.lte.${pair.endTime})`
          )
          .join(",")
      );

    if (error) this.throwError(error);

    console.log("getDataUptoDate result:", data);
    return data || [];
  }

  calculateTotal(
    matches: VallorentUptoDateDataArray,
    challenge: VallorentUptoDateData
  ) {
    console.log(
      "\n================================================================="
    );
    console.log("📊 CALCULATING MATCH TOTALS");
    console.log(
      "================================================================="
    );

    console.log("\n🎮 Input Matches Data:");
    console.log(JSON.stringify(matches, null, 2));
    console.log("\n🎯 Challenge Data:");
    console.log(JSON.stringify(challenge, null, 2));

    const status = challenge.match_status;
    const total: VallorentUptoDateData = {
      id: 0,
      match_start: "",
      match_end: "",
      total_kills: 0,
      deaths: 0,
      assists: 0,
      headshot: 0,
      spikes_planted: 0,
      spikes_defuse: 0,
      damage_done: 0,
      team_scores: 0,
      match_status: status,
      agent: "",
      region: "",
      game_mode: "",
      damage_taken: 0,
      userId: "",
    };

    // Ensure matches is always an array
    const matchesArray = matches
      ? Array.isArray(matches)
        ? matches
        : [matches]
      : [];
    console.log(
      "\n🔄 Processing matches:",
      matchesArray.length,
      "match(es) found"
    );

    // Process each match and accumulate totals
    matchesArray.forEach((match, index) => {
      if (!match) {
        console.log(`⚠️ Skipping null match at index ${index}`);
        return;
      }
      console.log(`\n📝 Processing match ${index + 1}:`);
      console.log(`Kills: ${match.total_kills}`);
      console.log(`Deaths: ${match.deaths}`);
      console.log(`Assists: ${match.assists}`);

      // Add match stats to totals
      total.assists += Number(match.assists) || 0;
      total.damage_done += Number(match.damage_done) || 0;
      total.damage_taken += Number(match.damage_taken) || 0;
      total.deaths += Number(match.deaths) || 0;
      total.headshot += Number(match.headshot) || 0;
      total.spikes_defuse += Number(match.spikes_defuse) || 0;
      total.spikes_planted += Number(match.spikes_planted) || 0;
      total.team_scores += Number(match.team_scores) || 0;
      total.total_kills += Number(match.total_kills) || 0;
    });

    console.log("\n📊 Final Totals:");
    console.log(JSON.stringify(total, null, 2));
    console.log(
      "=================================================================\n"
    );

    return total;
  }

  uploadChallenges: (data: any) => Promise<void> = async (data) => {
    const res = await this.dbInstance!.from("game_challenges").insert([
      ...data,
    ]);
    if (res.error) this.throwError(res.error);
  };

  editChallenge: (data: any, id: string) => Promise<void> = async (
    data: any,
    id: string
  ) => {
    const res = await this.dbInstance!.from("game_challenges")
      .update({ ...data })
      .eq("id", id);
    if (res.error) this.throwError(res.error);
  };

  async uploadProgress(progress: UploadProgress) {
    console.log("progress", progress);
    const { data, error } = await this.dbInstance!.from("vallorent_progress")
      .insert([...progress])
      .select();
    if (error) this.throwError(error);
    return data;
  }

  async upsertProgress(progress: UpsertData) {
    try {
      const challengeIdArray: Array<string> = [];
      const progressMp = new Map<string, progress>();

      console.log("progress from upsert progress", progress);

      progress.forEach((pr) => {
        const id = pr.challengeId;
        progressMp.set(id, pr);
        challengeIdArray.push(id.toString());
      });

      let res, data, error;

      console.log("challengeArray", progressMp);
      if (challengeIdArray.length > 0) {
        res = await this.dbInstance!!.from("vallorent_progress")
          .select("id , challengeId ,userId , requirement")
          .in("challengeId", challengeIdArray);
        data = res.data;
        error = res.error;
        if (error) {
          console.error("Error fetching existing progress:", error);
          this.throwError(error);
        }
      }

      const updateArray: UploadProgress = [];
      const insertArray: UploadProgress = [];
      const deleteArray: Array<string> = [];

      if (data) {
        console.log("data from vallorent_progress: ", data);
        data.forEach((dt) => {
          const id = dt.challengeId;
          const found = progressMp.get(id);
          console.log("found", found);
          if (found) {
            if (found.isCompleted) {
              updateArray.push({
                ...dt,
                requirement: found.requirement,
              });
            } else {
              updateArray.push({ ...dt, requirement: found.requirement });
            }
            progressMp.delete(id);
          }
        });
      }

      progressMp.forEach((val, key) => {
        const requirement = val.requirement;
        const challengeId = val.challengeId;
        const userId = val.userId;
        insertArray.push({
          requirement,
          challengeId,
          userId,
        });
      });

      let update, insert, del;

      console.log(
        "Database operations to perform:",
        "\nUpdates:",
        updateArray,
        "\nInserts:",
        insertArray,
        "\nDeletes:",
        deleteArray
      );

      if (updateArray.length > 0) {
        update = this.dbInstance!.from("vallorent_progress")
          .upsert([...updateArray])
          .select();
      }
      if (insertArray.length > 0) {
        insert = this.dbInstance!.from("vallorent_progress")
          .insert([...insertArray])
          .select();
      }
      if (deleteArray.length > 0) {
        del = this.dbInstance!.from("vallorent_progress")
          .delete()
          .in("id", deleteArray);
      }

      const promiseArray = [];

      if (updateArray.length) promiseArray.push(update);
      if (insertArray.length) promiseArray.push(insert);
      if (deleteArray.length) promiseArray.push(del);

      const resp: any = await Promise.all(promiseArray);

      const updatedProgress: Array<any> = [];
      resp.forEach((res: any, i: number) => {
        if (res.error) {
          console.error("Error in database operation:", res.error);
          this.throwError(res.error);
        }
        if (i != 2) updatedProgress.push(res.data);
      });

      console.log("Final updated progress:", updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error("Error in upsertProgress:", error);
      throw error;
    }
  }

  async deleteChallenge(challengeId: string) {
    const { data, error } = await this.dbInstance!.from("vallorent_progress")
      .delete()
      .eq("id", challengeId);
    if (error) this.throwError(error);
    return data;
  }

  async getProgressData(userId: string) {
    const { data, error } = await this.dbInstance!.from(
      "vallorent_progress"
    ).select("*");
    if (error) this.throwError(error);
    return data;
  }
}

export const vallorent = new Vallorent();
