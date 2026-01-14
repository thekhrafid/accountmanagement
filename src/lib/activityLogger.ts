import prisma from "@/lib/prisma";

type LogParams = {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  meta?: any;
};

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  meta,
}: LogParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        meta,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
