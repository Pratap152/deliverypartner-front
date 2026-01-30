import apiClient from '../ApiClient';
import { ORDER_STATUS } from '../../config/orderStates';

class OrderService {

    /**
     * Reject order
     */
    async rejectOrder(orderId, reason) {
        try {
            console.log(`[OrderService] Rejecting order ${orderId}`);
            const response = await apiClient.patch(`/api/orders/${orderId}/reject`, { reason });
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] rejectOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Accept order
     */
    async acceptOrder(orderId) {
        try {
            console.log(`[OrderService] Accepting order ${orderId}`);
            // No riderId needed in body anymore
            const response = await apiClient.patch(`/api/orders/${orderId}/accept`, {});

            return {
                success: true,
                status: ORDER_STATUS.PICKUP_ASSIGNED,
                data: response.data
            };
        } catch (error) {
            console.error(
                '[OrderService] acceptOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, newStatus) {
        console.log(`[OrderService] Updating order ${orderId} to ${newStatus}`);

        try {
            if (newStatus === ORDER_STATUS.ORDER_PICKED_UP) {
                return await this.pickupOrder(orderId);
            } else if (newStatus === ORDER_STATUS.ORDER_DELIVERED) {
                return await this.deliverOrder(orderId);
            }

            // For static states (AT_RESTAURANT, AT_DROP), just return success
            return {
                success: true,
                status: newStatus,
            };
        } catch (error) {
            console.error(
                '[OrderService] updateOrderStatus error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * GET ORDER DETAILS (REAL API)
     */
    async getOrderDetails(orderId) {
        try {
            const url = `/api/orders/${orderId}/details`;
            console.log(`[OrderService] Fetching details from: ${url}`);

            const response = await apiClient.get(url);
            console.log(`[OrderService] Received response: `, JSON.stringify(response.data));

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Order fetch failed');
            }

            const order = response.data.order;
            if (!order) {
                console.log("[OrderService] 'order' field missing in response");
                return null;
            }

            // Map backend response to frontend expected structure
            const mappedOrder = {
                orderId: order.orderId,
                vendorShopName: order.vendorShopName,
                items: order.items || [],
                pickupAddress: {
                    name: order.pickupAddress?.name,
                    addressLine: order.pickupAddress?.addressLine,
                    contactNumber: order.pickupAddress?.contactNumber,
                    lat: order.pickupAddress?.location?.coordinates?.[1] || 0,
                    lng: order.pickupAddress?.location?.coordinates?.[0] || 0,
                },
                deliveryAddress: {
                    name: order.deliveryAddress?.name,
                    addressLine: order.deliveryAddress?.addressLine,
                    contactNumber: order.deliveryAddress?.contactNumber,
                    lat: order.deliveryAddress?.location?.coordinates?.[1] || 0,
                    lng: order.deliveryAddress?.location?.coordinates?.[0] || 0,
                },
                pricing: order.pricing || {},
                riderEarning: order.riderEarning || {},
                orderStatus: order.orderStatus === 'PICKED_UP' ? ORDER_STATUS.ORDER_PICKED_UP : order.orderStatus,
                tracking: order.tracking || {}, // distanceInKm, durationInMin
                createdAt: order.createdAt
            };

            console.log(`[OrderService] Mapped order: `, JSON.stringify(mappedOrder));
            return mappedOrder;
        } catch (error) {
            console.error(
                '[OrderService] getOrderDetails error:',
                error?.response?.data || error.message
            );
            // If it's a 404 or similar, rethrow
            throw error;
        }
    }
    /**
     * Mark order as picked up
     */
    async pickupOrder(orderId) {
        try {
            const response = await apiClient.patch(
                `/api/orders/${orderId}/pickup`,
                {}
            );
            console.log('[OrderService] pickupOrder success:', response.data);
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] pickupOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Mark order as delivered
     */
    async deliverOrder(orderId) {
        try {
            const response = await apiClient.patch(
                `/api/orders/${orderId}/deliver`,
                {}
            );
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] deliverOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Cancel order
     */
    async cancelOrder(orderId, reasonCode, reasonText) {
        try {
            const response = await apiClient.patch(
                `/api/orders/${orderId}/cancel`,
                { reasonCode, reasonText }
            );
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] cancelOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }
}

export const orderService = new OrderService();