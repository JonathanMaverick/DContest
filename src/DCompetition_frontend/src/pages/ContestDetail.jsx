import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import BottomCard from "../components/BottomCard";
import { DCompetition_backend_contest } from "declarations/DCompetition_backend_contest";
import { DCompetition_backend_contestant } from "declarations/DCompetition_backend_contestant";
import { convertDate } from "../tools/date";
import { Button, Card, Skeleton, CardBody } from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";

function ContestDetail() {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  const { getPrincipal, getUserData } = useUserAuth();
  const [id, setID] = useState("");
  const { competitionID } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().getTime();
  const inputRef = useRef(null);
  const [contestants, setContestants] = useState([]);
  const [user, setUser] = useState(null);

  const changeToUrl = (picture) => {
    let url = "";
    if (picture) {
      let blob = new Blob([picture], {
        type: "image/jpeg",
      });
      url = URL.createObjectURL(blob);
    }
    return url;
  };

  useEffect(() => {
    const getContestant = async () => {
      try {
        const c = await DCompetition_backend_contestant.getContestantsByCompetitionId(Number(competitionID));

        const ct = c.map((cont) => ({
          ...cont,
          contestant_id: Number(cont.contestant_id),
          principal_id: cont.principal_id,
          competition_id: Number(cont.competition_id),
          photo_url: changeToUrl(cont.photo_url),
        }));
        setContestants(ct);
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };
    getContestant();
  }, [competitionID]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id !== "") {
        const fetchedUser = await getUserData(id);
        setUser(fetchedUser[0]);
      }
    };
    fetchUserData();
  }, [id, getUserData]);

  useEffect(() => {
    const principalID = async () => {
      try {
        const principal = await getPrincipal();
        setID(principal);
      } catch (error) {
        console.error("Error getting principal:", error);
      }
    };
    principalID();
  }, [getPrincipal]);

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
        await DCompetition_backend_contest.getCompetitionById(contestID);
      setContest(updatedCompetitions(con[0]));
    } catch (error) {
      console.error("Error fetching contest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const file = inputRef.current.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const picture = new Uint8Array(await file.arrayBuffer());

    try {
      await DCompetition_backend_contestant.addContestant(id, Number(competitionID), picture);
      alert("Success! Your contestant has been added.");
    } catch (error) {
      console.error("Error adding contestant:", error);
      alert("Failed to add contestant.");
    }
  };

  useEffect(() => {
    if (contest === null && loading) {
      getContestByID();
    }
  }, [contest, loading]);
  console.log(user)

  if (loading || user === null) {
    return (
      <div className="flex w-full gap-x-4">
        {/* Loading Skeleton */}
        <div className="flex flex-col w-2/5 h-full gap-y-3">
          <Skeleton className="h-12 w-full mb-3 rounded-lg bg-default-300" />
          <Skeleton className="h-8 w-1/3 mb-6 rounded-lg bg-default-300" />
          <Skeleton className="h-12 w-full rounded-lg mt-4 bg-default-300" />
        </div>
        <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg p-6">
          <Skeleton className="h-52 w-full mb-2 rounded-lg bg-default-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-x-4">
      <div className="flex flex-col w-2/5 h-full gap-y-3">
        <div className="py-3 px-4 gap-1 h-1/5">
          <div className="text-4xl font-medium text-left">{contest.name}</div>
          <div className="text-1xl font-medium text-left pl-1">{contest.category}</div>
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
        <Button className={`w-full ${statusColors[contest.status]}`}>Join</Button>
        <form onSubmit={handleOnSubmit} className="mt-4">
          <input ref={inputRef} type="file" accept="image/*" className="mb-2" />
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg justify-center items-center overflow-y-scroll p-6">
        <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
          {contestants.length > 0 ? (
            contestants.map((contestant, idx) => (
              <div
                key={idx}
                className="bg-opacity-40 flex flex-col items-center justify-center p-3 transition-transform transform hover:scale-[1.02] cursor-pointer"
              >
                <img
                  src={contestant.photo_url}
                  className="w-56 h-52 rounded-t-lg"
                />
                <div
                  className={`w-56 h-16 ${statusColors[contest.status]} rounded-b-lg flex flex-col py-1 px-2`}
                >
                  <div className="text-lg font-semibold">{user.username}</div>
                  <div className="text-xs font-semibold">ganteng</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white">No contestants available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestDetail;
