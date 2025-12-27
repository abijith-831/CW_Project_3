import { useEffect } from "react";
import type { RootState } from "../../redux/store";
import RatingTable from "../../Components/RatingsTable/RatingsTable";
import Fixture from "../../Components/Fixture/Fixture";
import { generateMatches } from "../../engine/matchGenerator";

import { useDispatch, useSelector } from "react-redux";
import { addRound } from "../../redux/slices/RoundsSlice";
// import { DataTable } from "@cloudwick/astral-ui"

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

  // const columns = [
  //   { key: "rank", header: "Rank", size: 50 },
  //   { key: "name", header: "Team Name", selected: true, size: 200 },
  //   { key: "played", header: "Played", size: 80 },
  //   { key: "won", header: "Won", size: 80 },
  //   { key: "drawn", header: "Drawm", size: 80 },
  //   { key: "lost", header: "Lost", size: 80 },
  //   { key: "goal_points", header: "Goals", size: 80 },
  //   { key: "rating", header: "Rating", selected: true, size: 100 },
  // ];

  // const tableData = teams
  // .sort((a, b) => b.rating - a.rating)
  // .map((team, index) => ({
  //   ...team,
  //   rank: index + 1,
  // }));
  


  // const data = [
  //   { rank: 1, name: "Arsenal", played: 10, won: 8, rating: 1200 },
  //   { rank: 2, name: "Chelsea", played: 10, won: 7, rating: 1150 },
  //   { rank: 3, name: "Liverpool", played: 10, won: 6, rating: 1100 },
  // ];

  return (
    <div className="p-6 bg-cover bg-fixed bg-[#F0F0F0]" >
      <div className="relative flex items-center mb-6 px-6 py-4">
        <h1 className="text-4xl text-gray-900  absolute left-1/2 transform -translate-x-1/2 ">
          Cloudwick Premier League
        </h1> 

        <div className="ml-auto flex gap-6">
          {/* future buttons */}
        </div>
      </div>
      {/* <DataTable columns={columns} data={tableData} /> */}

      <RatingTable teams={teams} />
      

      <Fixture teams={teams} rounds={rounds} />
    </div>
  );
};

export default LandingPage;
