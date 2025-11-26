import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SUPERADMIN_API_END_POINT } from "@/utils/constant";

const RecruitersTab = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${SUPERADMIN_API_END_POINT}/recruiters/pending`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) setRecruiters(res.data.recruiters);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const approve = async (id) => {
    try {
      await axios.patch(
        `${SUPERADMIN_API_END_POINT}/recruiter/approve/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Recruiter approved");
      setRecruiters((prev) => prev.filter((r) => String(r._id) !== String(id)));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Approve failed");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${SUPERADMIN_API_END_POINT}/recruiter/${id}`, {
        withCredentials: true,
      });
      toast.success("Recruiter deleted");
      setRecruiters((prev) => prev.filter((r) => String(r._id) !== String(id)));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Pending Recruiters</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {recruiters.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No pending recruiters
            </div>
          )}
          {recruiters.map((r) => (
            <div
              key={r._id}
              className="p-3 border rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {r.fullname}{" "}
                  <span className="text-sm text-gray-500">({r.email})</span>
                </div>
                <div className="text-sm text-gray-600">Role: {r.role}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => approve(r._id)}>Approve</Button>
                <Button
                  onClick={() => remove(r._id)}
                  className="bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruitersTab;
