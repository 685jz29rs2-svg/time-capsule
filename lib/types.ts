export type CapsuleStatus = "draft" | "pending_payment" | "sealed" | "delivered";

export type Capsule = {
  id: string;
  token: string;
  senderName: string;
  recipientEmail: string;
  body: string;
  openAt: string;
  createdAt: string;
  sealedAt: string | null;
  deliveredAt: string | null;
  status: CapsuleStatus;
  stripeSessionId: string | null;
};

export type CapsuleDraft = {
  senderName?: string;
  recipientEmail: string;
  body: string;
  openAt: string;
};

export type PublicCapsuleCard = {
  id: string;
  openAt: string;
  status: CapsuleStatus;
};
