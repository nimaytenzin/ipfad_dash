export class SendNotificationDTO {
    paymentAdviseId?: number | null = null;
    paymentReceiptId?: number | null = null;
    leaseAgreementId?: number | null = null;
    fromUserId: number;
    toUserId: number;
    damageItemId?: number;
    notificationType: string;
}

export class BroadcastNotificationToAllUnderAdminDTO {
    adminId: number;
    message: string;
}

export class BroadcastNotificationToAPlotUnderAdminDTO {
    plotId: number;
    message: string;
}
