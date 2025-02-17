import { getPrisma } from "@/libs/getPrisma";
import { Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export type StudentGetResponse = {
  students: Student[];
};

export const GET = async () => {
  const prisma = getPrisma();
  const Studentss = await prisma.Student.findMany({
    orderBy: [
      {
        studentId: 'asc',
      },
    ]
  });

  

  return NextResponse.json<StudentGetResponse>({
    students: Studentss, //replace empty array with result from DB
  });
};

export type StudentPostOKResponse = { ok: true };
export type StudentPostErrorResponse = { ok: false; message: string };
export type StudentPostResponse =
  | StudentPostOKResponse
  | StudentPostErrorResponse;

export type StudentPostBody = Pick<
  Student,
  "studentId" | "firstName" | "lastName"
>;

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as StudentPostBody;
  const prisma = getPrisma();
  const data = await request.formData();
  const studentId = data.get('studentId') as string;
  const firstName = data.get('firstName') as string;
  const lastName = data.get('lastName') as string;
  try {
    await prisma.Student.create({
      data: {
        studentId,
        firstName,
        lastName,
      },
    });
    return NextResponse.json<StudentPostOKResponse>({ ok: true });
  }
  catch{
    return NextResponse.json<StudentPostErrorResponse>(
        { ok: false, message: "Student Id already exists" },
        { status: 400 }
      );
  }
};
  //4. Add new Student data
  // await prisma...

  // return NextResponse.json<StudentPostErrorResponse>(
  //   { ok: false, message: "Student Id already exists" },
  //   { status: 400 }
  // );

  // return NextResponse.json<StudentPostOKResponse>({ ok: true });

