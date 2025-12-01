import CourseCard from "@/components/CourseCard";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import FullScreenLoader from "@/components/FullScreenLoader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoading } from "@/reduxStore/appSlice";

function Explore() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  let [response, setReponse] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const maxPage = 10;

  console.log("isLoading:", isLoading);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/suggest/explore-course?page=${page}&limit=10`
      );
      if (response.status == 200) {
        setReponse(response.data.courses || []);
        setLoading(false);
      }
      console.log("response:", response.data.courses);
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    const currentPage = Number(searchParams.get("page"));
    if (!currentPage) {
      navigate(`/explore?page=${1}`, { replace: true });
    } else {
      setPage(currentPage);
    }
  }, [searchParams]);

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="pb-15 pt-0 px-10">
        <h3 className="text-center underline text-xl py-8">Explore courses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-y-9 gap-x-10">
          {response.length == 0 ? (
            <span className="text-center text-gray-500 text-xl py-8">
              No more courses
            </span>
          ) : (
            <></>
          )}
          {response.map((course) => (
            <div className="gap-2" key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        <div className="pt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={"cursor-pointer"}
                  onClick={() => {
                    page > 1
                      ? navigate(`/explore?page=${Number(page) - 1}`)
                      : null;
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className={"cursor-pointer"}
                  onClick={() => navigate(`/explore?page=1`)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className={"cursor-pointer"}
                  onClick={() => navigate(`/explore?page=2`)}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={"cursor-pointer"}
                  onClick={() => {
                    if (response.length === 0) {
                      return;
                    }
                    page < maxPage
                      ? navigate(`/explore?page=${Number(page) + 1}`)
                      : null;
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }
}

export default Explore;
