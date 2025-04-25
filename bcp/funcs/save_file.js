import Client from "ssh2-sftp-client";

export const save_file = async ({ content }) => {
  const sftp = new Client();

  await sftp.connect({
    host: "localhost",
    port: 2222,
    username: "foo",
    password: "pass",
  });

  const remote_path = "/upload/planilla.xml";
  const buffer = Buffer.from(content, "utf-8");

  await sftp.put(buffer, remote_path);
  console.log("archivo subido correctamente", remote_path);
  await sftp.end();
};
