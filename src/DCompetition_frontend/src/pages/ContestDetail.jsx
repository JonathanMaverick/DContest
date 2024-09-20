import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BottomCard from "../components/BottomCard";
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";
import { convertDate } from "../tools/date";
import { Button, Card, Skeleton, CardBody } from "@nextui-org/react";

function ContestDetail() {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  const { competitionID } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().getTime();

  const updatedCompetitions = (comp) => {
    const startDate = convertDate(Number(comp.startDate));
    const endDate = convertDate(Number(comp.endDate));
    const votingEndDate = convertDate(Number(comp.votingEndDate));

    let status = "Not Started";
    let deadline = startDate;
    if (currentDate >= startDate && currentDate < endDate) {
      status = "Ongoing";
      deadline = endDate;
    } else if (currentDate >= endDate && currentDate < votingEndDate) {
      status = "Winner Selection";
      deadline = votingEndDate;
    } else if (currentDate >= votingEndDate) {
      status = "Completed";
    }

    return {
      ...comp,
      competition_id: Number(comp.competition_id),
      startDate,
      endDate,
      votingEndDate,
      reward: Number(comp.reward),
      status,
      deadline,
      category: comp.category,
    };
  };

  const getContestByID = async () => {
    try {
      const contestID = Number(competitionID);
      const con =
        await DCompetition_backend_competition.getCompetitionById(contestID);
      setContest(updatedCompetitions(con[0]));
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching contest:", error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };

  useEffect(() => {
    if (contest === null && loading) {
      getContestByID();
    }
  }, [contest, loading]);

  if (loading) {
    // Display skeleton loading UI while data is being fetched
    return (
      <div className="flex w-full gap-x-4">
        {/* Left Column: Contest Details */}
        <div className="flex flex-col w-2/5 h-full gap-y-3">
          {/* Skeleton for Contest Name and Category */}
          <Skeleton className="h-12 w-full mb-3 rounded-lg bg-default-300" />
          <Skeleton className="h-8 w-1/3 mb-6 rounded-lg bg-default-300" />

          {/* Skeleton for BottomCard (Reward, Submissions, Deadline, Status) */}
          <Card radius="lg">
            <CardBody className="p-4 space-y-4">
              <Skeleton className="h-10 w-2/3 rounded-lg bg-default-300" />
              <Skeleton className="h-4 w-1/4 rounded-lg bg-default-300" />
              <Skeleton className="h-4 w-1/3 rounded-lg bg-default-300" />
            </CardBody>
          </Card>

          {/* Skeleton for Description Section */}
          <Skeleton className="h-6 w-1/4 mt-4 mb-2 rounded-lg bg-default-300" />
          <Skeleton className="h-24 w-full rounded-lg bg-default-300" />

          {/* Skeleton for Join Button */}
          <Skeleton className="h-12 w-full rounded-lg mt-4 bg-default-300" />
        </div>

        {/* Right Column: Submissions Grid */}
        <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Skeletons for the individual cards */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-full">
                <Skeleton className="h-52 w-full mb-2 rounded-lg bg-default-300" />
                <Skeleton className="h-10 w-3/4 rounded-lg bg-default-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          reward={Number(contest.reward)}
          submissions="20"
          deadline={contest.deadline}
          status={contest.status}
          endDate={contest.endDate}
        />
        <div className="bg-black bg-opacity-40 rounded-lg p-4 gap-1 flex flex-col">
          <div className="text-xl font-semibold">Description :</div>
          <div className="text-sm text-justify">
            {contest.description || "No description available."}
          </div>
        </div>
        <Button className={`w-full ${statusColors[contest.status]}`}>
          Join
        </Button>
      </div>
      <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg justify-center items-center overflow-y-scroll p-6">
        <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-opacity-40 flex flex-col items-center justify-center p-3 transition-transform transform hover:scale-[1.02] cursor-pointer"
            >
              <img
                src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                className="w-56 h-52 rounded-t-lg"
                alt="Contest placeholder"
              />
              <div
                className={`w-56 h-16 ${statusColors[contest.status]} rounded-b-lg flex flex-col py-1 px-2`}
              >
                <div className="text-lg font-semibold">#username</div>
                <div className="text-xs font-semibold">timestamp</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContestDetail;
