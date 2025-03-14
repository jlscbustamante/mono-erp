module.exports = {
  apps: [
    {
      name: 'pos-1',
      script: './main.ts',
      interpreter: 'deno',
      interpreter_args: 'run --allow-net --env-file --allow-env --allow-read --allow-write',
      env: {
        PORT: 8004
      }
    },
    {
      name: 'pos-2',
      script: './main.ts',
      interpreter: 'deno',
      interpreter_args: 'run --allow-net --env-file --allow-env --allow-read --allow-write',
      env: {
        PORT: 8005
      }
    },
    {
      name: 'pos-3',
      script: './main.ts',
      interpreter: 'deno',
      interpreter_args: 'run --allow-net --env-file --allow-env --allow-read --allow-write',
      env: {
        PORT: 8006
      }
    }
  ]
};
