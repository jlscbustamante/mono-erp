import { format } from "date-fns";
import { Hono } from "hono";
import { ATTENDANCE_EVENT } from "pizzadb";
import { Raw } from "typeorm";
import { attendanceRepository, employeeRepository } from "../repositories";
import { S3Service } from "../services/s3.service";
import { getDatePath } from "../utils";

const s3Service = new S3Service();
const app = new Hono();

app.get("/users", async (c) => {
  const users = await employeeRepository.find({});
  return c.json({
    data: users,
  });
});

app.get("/users/:doc", async (c) => {
  try {
    const dni = c.req.param("doc");
    const user = await employeeRepository.findOne({
      where: {
        doc_number: dni,
      },
    });

    if (!user) {
      throw new Error("No se encontro el usuario");
    }

    return c.json({
      data: user,
    });
  } catch (err: any) {
    c.status(404);
    return c.json({
      data: err.message,
    });
  }
});

app.get("/checkin", async (c) => {
  try {
    const dni = c.req.query("dni");
    const user = await employeeRepository.findOne({
      where: {
        doc_number: dni,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        gender: true,
      },
    });

    if (!user) throw new Error("No se encontro el usuario");

    return c.json({
      data: user,
    });
  } catch (err: any) {
    c.status(404);
    return c.json({
      data: err.message,
    });
  }
});

app.post("/register", async (c) => {
  try {
    // const body = c.req.json();
    const formData = await c.req.parseBody();
    const photo = formData["archivo"] as File;
    const id_employee = formData["id_employee"] as string;
    const event = formData["event"] as string;

    const user = await employeeRepository.findOne({
      where: {
        id: +id_employee,
      },
    });
    if (!user) throw new Error("No se encontro el usuario");

    const path = getDatePath();
    const pathUser = `${path}/${user.doc_number}.jpg`;

    const resultPath = await s3Service.uploadAssistanceFile(photo, pathUser);

    await attendanceRepository.insert({
      employee_id: user.id,
      event: event as ATTENDANCE_EVENT,
      pic_photo: resultPath,
      attendance_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });

    return c.json({
      data: {
        id_employee,
        event,
      },
    });
  } catch (err: any) {
    c.status(404);
    return c.json({
      data: err.message,
    });
  }
});

app.get("/verify", async (c) => {
  try {
    const docNumber = c.req.query("dni");
    const date = c.req.query("date");

    const user = await employeeRepository.findOne({
      where: {
        doc_number: docNumber,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        gender: true,
      },
    });
    if (!user) throw new Error("No se encontro el usuario");

    const attendance = await attendanceRepository.find({
      where: {
        employee_id: user.id,
        attendance_at: Raw((alias) => `DATE(${alias}) = :date`, { date }),
      },
    });
    if (attendance.length == 0) {
      return c.json({
        data: null,
      });
    }

    const firstPathFounded = attendance.find((el) => el.pic_photo);
    let url: string | undefined = undefined;
    if (firstPathFounded) {
      url = await s3Service.getPresignedUrl(firstPathFounded.pic_photo);
    }

    return c.json({
      data: {
        user,
        records: attendance.map((el) => ({
          datetime: el.attendance_at,
          event: el.event,
        })),
        photo: url ?? null,
      },
    });
  } catch (err: any) {
    c.status(404);
    return c.json({
      message: err.message,
    });
  }
});

export default app;
