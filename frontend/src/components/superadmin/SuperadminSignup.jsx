import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SUPERADMIN_API_END_POINT } from "@/utils/constant";

const SuperadminSignup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoadingLocal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });
  const changeFile = (e) => setFile(e.target.files?.[0]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingLocal(true);
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("password", input.password);
      formData.append("role", "superadmin");
      if (file) formData.append("file", file);

      const res = await axios.post(
        `${SUPERADMIN_API_END_POINT}/create`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Superadmin created. Please login");
        navigate("/superadmin/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto my-10">
        <form onSubmit={submitHandler} className="p-6 border rounded">
          <h2 className="text-xl font-semibold mb-4">Create Superadmin</h2>
          <div className="mb-3">
            <Label>Full name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
            />
          </div>
          <div className="mb-3">
            <Label>Email</Label>
            <Input
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div className="mb-3">
            <Label>Phone</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
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
          <div className="mb-3">
            <Label>Profile photo (optional)</Label>
            <Input type="file" accept="image/*" onChange={changeFile} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 text-white">
              {loading ? "Creating..." : "Create"}
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

export default SuperadminSignup;
