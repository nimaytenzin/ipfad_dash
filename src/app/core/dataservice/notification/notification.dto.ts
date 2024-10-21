export class SendNotificationDTO {
    paymentAdviseId?: number | null = null;
    leaseAgreementId?: number | null = null;
    fromUserId: number;
    toUserId: number;
    damageItemId?: number;
    notificationType: string;
}
