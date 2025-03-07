import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function searchCourses(term: string) {
  const searchQuery = defineQuery(`*[_type == "course" && (
    title match $term + "*" ||
    description match $term + "*" ||
    category->name match $term + "*"
  )] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    price,
    description,
    "slug": slug.current,
    image {
      asset->{
        _ref,
        _type,
        _weak
      },
      hotspot,
      crop,
      _type
    },
    "category": category->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      description,
      icon,
      color
    },
    "instructor": instructor->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      bio,
      photo {
        asset->{
          _ref,
          _type,
          _weak
        },
        hotspot,
        crop,
        _type
      }
    },
    modules[]->{
      _ref,
      _type,
      _weak,
      _key,
      [internalGroqTypeReferenceTo]
    }
  }`);

  const result = await sanityFetch({
    query: searchQuery,
    params: { term },
  });

  return result.data || [];
}