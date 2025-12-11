# EDGE

EDGE - Basketball Referee Performance Management System




pnpm --filter @workspace/db db:migrate


pnpm drizzle-kit studio

pnpm dotenv -e ./.env -- pnpm --filter @workspace/db studio


pnpm dlx dotenv-cli -c -- pnpm --filter @workspace/db push && pnpm run build

pnpm dev


deizzel studio
pnpm dlx dotenv-cli -c -- pnpm --filter @workspace/db studio


NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm dlx dotenv-cli -c -- pnpm --filter @workspace/db studio


migrations
 pnpm dlx dotenv-cli -c -- pnpm --filter @workspace/db push


