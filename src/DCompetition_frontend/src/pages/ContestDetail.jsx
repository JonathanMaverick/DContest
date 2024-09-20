import { useParams } from "react-router-dom";
import { FaTrophy, FaUsers } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import BottomCard from "../components/BottomCard";
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";

function ContestDetail() {
  const { competitionID } = useParams();
  const [contest, setContests] = useState(null);

  const getContestByID = async () => {
    try {
      const contestID = parseInt(competitionID);
      const contest = await DCompetition_backend_competition.getCompetitionById(contestID);
      console.log("helloo");
      console.log(contest);
      setContest(contest[0]);
    } catch (error) {
      console.error("Error fetching contest:", error);
    }
  };

  useEffect(() => {
    getContestByID();
  }, [competitionID]);

  const targetDate = new Date("Fri Sep 20 2024 11:14:29 GMT+0700");

  return (
    <div className="flex w-full gap-x-4">
      <div className="flex flex-col w-2/5 h-full gap-y-3">
        <div className="py-3 px-4 gap-1 h-1/5">
          <div className="text-4xl font-medium text-left">{contest.name}</div>
          <div className="text-1xl font-medium text-left pl-1">
          {contest.category}
          </div>
        </div>
        <BottomCard
          reward={contest.reward}
          submissions="20"
          deadline={contest.deadline}
          status="Not Started"
        />
        <div className="bg-black bg-opacity-40 rounded-lg p-4 gap-1 flex flex-col ">
          <div className="text-xl font-semibold">Description :</div>
          <div className="text-sm text-justify">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt
            harum dicta iste veniam sit illum consequuntur corporis deleniti.
            Dolores quis officiis fugit reprehenderit excepturi dolorem
            explicabo ducimus modi officia quam deserunt similique minima
            reiciendis quibusdam ipsam, unde tenetur repellat vel blanditiis
            laboriosam laborum! Fuga iusto quas id vitae autem. Facere, iste
            quasi aspernatur repellat sequi vitae. Nisi iure, repudiandae dolore
            deserunt labore laborum harum, beatae aliquam commodi, magnam
            similique corrupti animi ratione asperiores! Tenetur minima
            repudiandae fugiat iste eum quasi aut doloribus quia soluta veniam
            magni maiores molestiae dolore cumque officiis qui pariatur dolores,
            officia ad dicta! Doloribus, repudiandae officia.
          </div>
        </div>
        <div className="bg-purple-700 font-semibold h-10 w-full text-center flex items-center justify-center rounded-lg">
          Join
        </div>
      </div>
      <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg justify-center items-center overflow-y-scroll p-6">
        <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full justify-items-center">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div className="bg-opacity-40 flex flex-col items-center justify-center p-3 transition-transform transform hover:scale-[1.02] cursor-pointer">
              <img
                src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                className="w-56 h-52 rounded-t-lg"
              />
              <div className="w-56 h-16 bg-white rounded-b-lg bg-purple-700 flex flex-col py-1 px-2">
                <div className="text-lg font-semibold">#username</div>
                <div className="text-xs font-semibold">timestamp</div>
                {/* <div className="w-full h-6 bg-green-500 text-sm text-center rounded-lg mt-4">Detail</div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContestDetail;
