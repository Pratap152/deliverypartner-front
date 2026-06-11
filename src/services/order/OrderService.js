import apiClient from '../ApiClient';

class OrderService {

    // ---------------------------
    // ACCEPT ORDER
    // ---------------------------
    async acceptOrder(orderId) {
        try {
            console.log(`[OrderService] Accepting order ${orderId}`);

            const response = await apiClient.patch(
                `/api/orders/${orderId}/accept`
            );

            console.log("[OrderService] accept response:", response.data);

            return response.data; // { success, message }
        } catch (error) {
            console.error('[acceptOrder error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // REJECT ORDER
    // ---------------------------
    async rejectOrder(orderId) {
        try {
            console.log(`[OrderService] Rejecting order ${orderId}`);

            const response = await apiClient.patch(
                `/api/orders/${orderId}/reject`
            );

            console.log("[OrderService] reject response:", response.data);

            return response.data; // { success, message, pendingRiders }
        } catch (error) {
            console.error('[rejectOrder error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // GET ORDER DETAILS (SOURCE OF TRUTH)
    // ---------------------------
    async getOrderDetails(orderId) {
        try {
            const url = `/api/orders/${orderId}/details`;
            console.log(`[OrderService] Fetching: ${url}`);

            const response = await apiClient.get(url);

            console.log("[OrderService] details response:", response.data);

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to fetch order");
            }

            const order = response.data.order || response.data.filteredOrder;

            if (!order) return null;

            // ❗ IMPORTANT: NO STATUS MAPPING — USE API DIRECTLY
            return {
                orderId: order.orderId,
                vendorShopName: order.vendorShopName,
                items: order.items || [],

                pickupAddress: {
                    name: order.pickupAddress?.name,
                    addressLine: order.pickupAddress?.addressLine,
                    contactNumber: order.pickupAddress?.contactNumber,
                    lat: order.pickupAddress?.lat,
                    lng: order.pickupAddress?.lng,
                },

                deliveryAddress: {
                    name: order.deliveryAddress?.name,
                    addressLine: order.deliveryAddress?.addressLine,
                    contactNumber: order.deliveryAddress?.contactNumber,
                    lat: order.deliveryAddress?.lat,
                    lng: order.deliveryAddress?.lng,
                },

                pricing: order.pricing || {},
                riderEarning: order.riderEarning || {},
                payment: order.payment || {},
                allocation: order.allocation || {},
                tracking: order.tracking || {},

                // ✅ REAL STATUS FROM BACKEND ONLY
                orderStatus: order.orderStatus || response.data.orderStatus,

                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            };

        } catch (error) {
            console.error('[getOrderDetails error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // EN ROUTE TO PICKUP
    // ---------------------------
    async markEnRouteToPickup(orderId) {
        try {
            console.log(`[OrderService] Marking en route to pickup ${orderId}`);
            const response = await apiClient.patch(
                `/api/orders/${orderId}/en-route-pickup`
            );
            console.log("[en-route-pickup response]", response.data);
            return response.data;
        } catch (error) {
            console.error('[markEnRouteToPickup error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // ARRIVED AT PICKUP
    // ---------------------------
    async markArrivedAtPickup(orderId) {
        try {
            console.log(`[OrderService] Marking arrived at pickup ${orderId}`);
            const response = await apiClient.patch(
                `/api/orders/${orderId}/arrived-pickup`
            );
            console.log("[arrived-pickup response]", response.data);
            return response.data;
        } catch (error) {
            console.error('[markArrivedAtPickup error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // PICKUP ORDER
    // ---------------------------
    async pickupOrder(orderId) {
        try {
            console.log(`[OrderService] Picking up ${orderId}`);

            const response = await apiClient.patch(
                `/api/orders/${orderId}/pickup`
            );

            console.log("[pickup response]", response.data);

            return response.data; // { success, message, orderStatus }
        } catch (error) {
            console.error('[pickupOrder error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // IN TRANSIT
    // ---------------------------
    async markInTransit(orderId) {
        try {
            console.log(`[OrderService] Marking in transit ${orderId}`);
            const response = await apiClient.patch(
                `/api/orders/${orderId}/in-transit`
            );
            console.log("[in-transit response]", response.data);
            return response.data;
        } catch (error) {
            console.error('[markInTransit error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // ARRIVED AT DROP
    // ---------------------------
    async markArrivedAtDrop(orderId) {
        try {
            console.log(`[OrderService] Marking arrived at drop ${orderId}`);
            const response = await apiClient.patch(
                `/api/orders/${orderId}/arrived-drop`
            );
            console.log("[arrived-drop response]", response.data);
            return response.data;
        } catch (error) {
            console.error('[markArrivedAtDrop error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // DELIVER ORDER
    // ---------------------------
    async deliverOrder(orderId) {
        try {
            console.log(`[OrderService] Delivering ${orderId}`);

            const response = await apiClient.patch(
                `/api/orders/${orderId}/deliver`
            );

            console.log("[deliver response]", response.data);

            return response.data; 
            // { success, message, orderId, earningCredited, codCollected }
        } catch (error) {
            console.error('[deliverOrder error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // CANCEL ORDER
    // ---------------------------
    async cancelOrder(orderId, reasonCode, reasonText) {
        try {
            console.log(`[OrderService] Cancelling ${orderId}`);

            const response = await apiClient.patch(
                `/api/orders/${orderId}/cancel`,
                {
                    reasonCode,
                    reasonText
                }
            );

            console.log("[cancel response]", response.data);

            return response.data;
            // { success, message, cancelIssue }
        } catch (error) {
            console.error('[cancelOrder error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // ONLINE
    // ---------------------------
    async setRiderOnline() {
        try {
            const response = await apiClient.patch('/api/rider/status/online');
            return response.data;
        } catch (error) {
            console.error('[setRiderOnline error]', error?.response?.data || error.message);
            throw error;
        }
    }

    // ---------------------------
    // OFFLINE
    // ---------------------------
    async setRiderOffline() {
        try {
            const response = await apiClient.patch('/api/rider/status/offline');
            return response.data;
        } catch (error) {
            console.error('[setRiderOffline error]', error?.response?.data || error.message);
            throw error;
        }
    }
}

export const orderService = new OrderService();