import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { SUPERADMIN_API_END_POINT } from "@/utils/constant";

const SuperadminLogin = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoadingLocal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingLocal(true);
      const payload = { ...input };
      const res = await axios.post(
        `${SUPERADMIN_API_END_POINT}/login`,
        payload,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/superadmin");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto my-10">
        <form onSubmit={submitHandler} className="p-6 border rounded">
          <h2 className="text-xl font-semibold mb-4">Superadmin Login</h2>
          <div className="mb-3">
            <Label>Email</Label>
            <Input
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div className="mb-3">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 text-white">
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperadminLogin;
