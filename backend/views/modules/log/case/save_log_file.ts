export const save_log_file = async (row: string[], file_path: string) => {
  const erp_path = await check_or_create_erp_dir();
  const full_path = `${erp_path}/${file_path}`;

  try {
    // Check if file exists
    try {
      await Deno.stat(full_path);
      // File exists, append to it
      const content = row.join("   ") + "\n";
      await Deno.writeTextFile(full_path, content, { append: true });
    } catch (error) {
      // File doesn't exist, create it
      if (error instanceof Deno.errors.NotFound) {
        const content = row.join("   ") + "\n";
        await Deno.writeTextFile(full_path, content);
      } else {
        throw error; // Re-throw if it's a different error
      }
    }
  } catch (error: any) {
    throw new Error(`Failed to save log file: ${error.message}`);
  }
};

async function check_or_create_erp_dir(): Promise<string> {
  try {
    const home_dir = Deno.env.get("HOME");
    if (!home_dir) {
      throw new Error("HOME environment variable is not set.");
    }
    const erp_dir_path = `${home_dir}/.erp`;
    const info = await Deno.lstat(erp_dir_path);

    if (info.isDirectory) {
      // Directory already exists
      return erp_dir_path;
    } else {
      // Path exists but is not a directory, this case should ideally not happen or be handled as an error.
      // Forcing creation if it's a file might lead to data loss.
      // Assuming we want to create it if it's not a directory.
      await Deno.remove(erp_dir_path, { recursive: true }); // Remove if it's a file or something else
      await Deno.mkdir(erp_dir_path);
      return erp_dir_path;
    }
  } catch (err: any) {
    if (err instanceof Deno.errors.NotFound) {
      // Directory doesn't exist, create it
      try {
        const home_dir = Deno.env.get("HOME");
        if (!home_dir) {
          throw new Error("HOME environment variable is not set.");
        }
        const erp_dir_path = `${home_dir}/.erp`;
        await Deno.mkdir(erp_dir_path);
        return erp_dir_path;
      } catch (create_err: any) {
        throw new Error(
          `Failed to create .erp directory: ${create_err.message}`
        );
      }
    } else {
      // Some other error occurred
      throw new Error(`Error checking .erp directory: ${err.message}`);
    }
  }
}
