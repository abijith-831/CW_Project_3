import { useEffect } from "react";
import type { Team } from "../../models/teams";
import type { Round } from "../../models/round";
import type { RootState } from "../../redux/store";
import RatingTable from "../../Components/RatingsTable/RatingsTable";
import Fixture from "../../Components/Fixture/Fixture";
import { generateMatches } from "../../engine/matchGenerator";

import { useDispatch, useSelector } from "react-redux";
import { addRound } from "../../redux/slices/RoundsSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state: RootState) => state.teams.teams);
  const rounds = useSelector((state: RootState) => state.rounds.rounds);

  // Generate first round once teams are loaded
  useEffect(() => {
    if (teams.length > 1 && rounds.length === 0) {
      dispatch(
        addRound({
          roundNumber: 1,
          teams: teams,
          matches: generateMatches(teams, 1),
        })
      );
    }
  }, [teams, rounds.length, dispatch]);

  return (
    <div
      className="p-6 bg-cover bg-fixed"
      style={{ backgroundImage: "url('bg/bg-league.jpg')" }}
    >
      <div className="relative flex items-center mb-6 px-6">
        <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 text-neutral-200">
          Cloudwick Premier League
        </h1>

        <div className="ml-auto flex gap-6">
          {/* future buttons */}
        </div>
      </div>

      <RatingTable teams={teams} />
      

      <Fixture teams={teams} rounds={rounds} />
    </div>
  );
};

export default LandingPage;
