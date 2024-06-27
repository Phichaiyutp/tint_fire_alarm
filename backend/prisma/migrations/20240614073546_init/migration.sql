/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AjaxUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AjaxUser_email_key" ON "AjaxUser"("email");
