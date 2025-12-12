import React, { useState } from "react";
import CreateCourse from "./CreateCourse";
import DraftCourse from "./DraftCourse";
import PublishedCourse from "./PublishedCourse";
import CreatedCourse from "./CreatedCourse";

const tabs = [
  { id: "create", label: "Create" },
  { id: "draft", label: "Drafts" },
  { id: "created", label: "Yet to Publish" },
  { id: "published", label: "Published" },
];

const Instructor = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className=" dark:bg-gray-950">
      
      {/* Sticky Tab Bar */}
      <div className="top-0 z-50 backdrop-blur-md  dark:bg-gray-900/70 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-center">
          <div className="flex gap-3 pt-3 rounded-xl shadow-inner">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  sm:px-4 sm:py-2 px-2 py-3 cursor-pointer rounded-lg text-sm md:text-base font-medium transition 
                  ${activeTab === tab.id
                    ? "bg-gradient-to-r from-[#646cff] to-indigo-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50"}
                `}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "create" && <CreateCourse />}
        {activeTab === "draft" && <DraftCourse />}
        {activeTab === "published" && <PublishedCourse />}
        {activeTab === "created" && <CreatedCourse />}
      </div>

    </div>
  );
};

export default Instructor;
