import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          {/* Hide New Company button for recruiters who already have one */}
          {!(
            user &&
            user.role === "recruiter" &&
            companies &&
            companies.length > 0 &&
            companies.some((c) => String(c.userId) === String(user._id))
          ) && (
            <Button onClick={() => navigate("/admin/companies/create")}>
              New Company
            </Button>
          )}
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
