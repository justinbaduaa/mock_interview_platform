import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplaySkillIcons from "@/components/DisplaySkillIcons";

const InterviewDetails = async ({ params, searchParams }: {
  params: RouteParams['params'];
  searchParams: { retake?: string };
}) => {
  const { id } = await params;
  const isRetake = searchParams.retake === 'true';

  const user = await getCurrentUser();
  
  // Redirect if user is not authenticated
  if (!user || !user.id) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplaySkillIcons skills={interview.techstack} />
        </div>

        <p className="bg-[#f4ebdd] text-dark-100 font-medium px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        isRetake={isRetake}
      />
    </>
  );
};

export default InterviewDetails;
