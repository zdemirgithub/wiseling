import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import { internalGroqTypeReferenceTo, SanityImageCrop, SanityImageHotspot, Slug } from "@/sanity.types";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  // Fetch courses
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course: {
            _id: string;
            _type: "course";
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            title?: string;
            price?: number;
            slug: string | null;
            description?: string;
            image?: {
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
            };
            category: {
              _id: string;
              _type: "category";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              slug?: Slug;
              description?: string;
              icon?: string;
              color?: string;
            } | null;
            modules?: Array<{
              _ref: string;
              _type: "reference";
              _weak?: boolean;
              _key: string;
              [internalGroqTypeReferenceTo]?: "module";
            }>;
            instructor: {
              _id: string;
              _type: "instructor";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              bio?: string;
              photo?: {
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              };
            } | null;
          }) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}