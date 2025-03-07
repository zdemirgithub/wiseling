import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEnrolledCourses } from "@/sanity/lib/student/getEnrolledCourses";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { CourseCard } from "@/components/CourseCard";

// Updated Course type with correct image field structure
type Course = {
  _id: string;
  _type: "course";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  description: string;
  price?: number;
  slug: string | null;
  image?: {
    _type: "image";
    asset?: { _ref: string; _type: "reference"; _weak?: boolean };
    hotspot?: { _type: "sanity.imageHotspot"; x: number; y: number; height: number; width: number };
    crop?: { _type: "sanity.imageCrop"; top: number; bottom: number; left: number; right: number };
  } | undefined;
  category: {
    _id: string;
    _type: "category";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    slug?: { _type: "slug"; current: string };
    description?: string;
    icon?: string;
    color?: string;
  } | null;
  instructor: {
    _id: string;
    _type: "instructor";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name: string;
    bio?: string;
    photo?: { _type: "image"; asset?: { _ref: string; _type: "reference" }; hotspot?: { x: number; y: number; height: number; width: number } };
  } | null;
};

type EnrolledCourse = {
  course: Course;
};

type CourseWithProgress = {
  course: Course;
  progress: number;
};

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  // Get enrolled courses for the current user
  const enrolledCourses = await getEnrolledCourses(user.id);

  // Get progress for each enrolled course
  const coursesWithProgress: (CourseWithProgress | null)[] = await Promise.all(
    enrolledCourses.map(async ({ course }: EnrolledCourse) => {
      if (!course) return null;
      const progress = await getCourseProgress(user.id, course._id);
      return {
        course,
        progress: progress.courseProgress, // Adjust the actual progress value here
      };
    })
  );

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Courses</h1>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t enrolled in any courses yet. Browse our courses
              to get started!
            </p>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesWithProgress.map((item) => {
              if (!item || !item.course) return null;

              return (
                <CourseCard
                  key={item.course._id}
                  course={item.course}
                  progress={item.progress}
                  href={`/dashboard/courses/${item.course._id}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
