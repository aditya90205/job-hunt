import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SUPERADMIN_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SUPERADMIN_API_END_POINT}/jobs/pending`, {
        withCredentials: true,
      });
      if (res.data.success) setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const dispatch = useDispatch();

  const approve = async (id) => {
    try {
      await axios.patch(
        `${SUPERADMIN_API_END_POINT}/job/approve/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Job approved");
      setJobs((prev) => prev.filter((j) => String(j._id) !== String(id)));
      // refresh public job list so approved job appears
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res?.data?.success) dispatch(setAllJobs(res.data.jobs));
      } catch (err) {
        console.error("Failed to refresh public jobs", err);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Approve failed");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${SUPERADMIN_API_END_POINT}/job/${id}`, {
        withCredentials: true,
      });
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((j) => String(j._id) !== String(id)));
      // refresh public job list in case it was previously approved
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res?.data?.success) dispatch(setAllJobs(res.data.jobs));
      } catch (err) {
        console.error("Failed to refresh public jobs", err);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Pending Jobs</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {jobs.length === 0 && (
            <div className="text-sm text-muted-foreground">No pending jobs</div>
          )}
          {jobs.map((j) => (
            <div key={j._id} className="p-3 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-gray-600">
                    {j.company?.name || j.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    {j.location} • {j.jobType}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => approve(j._id)}>Approve</Button>
                  <Button
                    onClick={() => remove(j._id)}
                    className="bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsTab;
