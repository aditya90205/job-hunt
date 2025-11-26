import { useState } from "react";
import Navbar from "../shared/Navbar";
import RecruitersTab from "./RecruitersTab";
import JobsTab from "./JobsTab";
import { Button } from "../ui/button";

const SuperAdmin = () => {
  const [active, setActive] = useState("recruiters");

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-8">
        <h1 className="text-2xl font-bold mb-4">Superadmin Panel</h1>
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setActive("recruiters")}
            className={active === "recruiters" ? "bg-blue-600 text-white" : ""}
          >
            Recruiters
          </Button>
          <Button
            onClick={() => setActive("jobs")}
            className={active === "jobs" ? "bg-blue-600 text-white" : ""}
          >
            Jobs
          </Button>
        </div>

        <div>{active === "recruiters" ? <RecruitersTab /> : <JobsTab />}</div>
      </div>
    </div>
  );
};

export default SuperAdmin;
