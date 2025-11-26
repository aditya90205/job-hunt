import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);

  // If the logged-in recruiter already has a company, redirect them to their company page
  useEffect(() => {
    const checkRemote = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res?.data?.success && res?.data?.companies?.length > 0) {
          const myCompany = res.data.companies.find(
            (c) => String(c.userId) === String(user?._id)
          );
          if (myCompany) {
            toast?.success?.("You already have a company. Redirecting to it.");
            navigate(`/admin/companies/${myCompany._id}`);
          }
        }
      } catch (err) {
        // ignore: user may not have any companies or not authenticated
      }
    };

    if (user && user.role === "recruiter") {
      if (companies && companies.length > 0) {
        const myCompany = companies.find(
          (c) => String(c.userId) === String(user._id)
        );
        if (myCompany) {
          toast?.success?.("You already have a company. Redirecting to it.");
          navigate(`/admin/companies/${myCompany._id}`);
          return;
        }
      }
      // if local companies list is empty, fetch from server to be sure
      checkRemote();
    }
  }, [user, companies]);
  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to create company");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to give your company name? you can change this
            later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className="flex items-center gap-2 my-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
          >
            Cancel
          </Button>
          <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
