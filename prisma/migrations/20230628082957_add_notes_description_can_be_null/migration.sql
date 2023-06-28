-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';
