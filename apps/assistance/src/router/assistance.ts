import { Hono } from "hono";
import { ATTENDANCE_EVENT } from "pizzadb";
import { attendanceRepository, employeeRepository } from "../repositories";

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
    const body: {
      id_employee: number;
      event: ATTENDANCE_EVENT;
    } = await c.req.json();

    const user = await employeeRepository.findOne({
      where: {
        id: body.id_employee,
      },
    });
    if (!user) throw new Error("No se encontro el usuario");

    await attendanceRepository.insert({
      employee_id: user.id,
      event: body.event,
    });

    return c.json({
      data: body,
    });
  } catch (err: any) {
    c.status(404);
    return c.json({
      data: err.message,
    });
  }
});

export default app;
