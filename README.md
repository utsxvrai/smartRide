# SmartRide: Advanced Cab Pooling System

SmartRide is a high-performance backend system designed to solve the airport ride-pooling problem. It efficiently matches passengers sharing similar routes into cabs while respecting seat, luggage, and detour constraints, optimizing for both passenger cost and vehicle utility.

##  Tech Stack
- **Runtime**: Node.js (v22)
- **Framework**: Express.js
- **Database**: PostgreSQL (v15)
- **ORM**: Prisma 7.4.0 (with Driver Adapters)
- **Infrastructure**: Docker & Docker Compose
- **Logic**: Greedy Selection Algorithm + Haversine Distance Formula

## 🛠 Setup & Run Instructions
The entire system is Dockerized for a "one-command" setup.

1.  **Clone the repository** and navigate to the project root.
2.  **Start the environment**:
    ```powershell
    docker-compose up --build -d
    ```
3.  **Initialize Database & Seed Data**:
    ```powershell
    docker-compose exec app npx prisma db push
    docker-compose exec app npm run seed
    ```
4.  **Access the API**: The server will be running at `http://localhost:3000/api/v1`.
5.  **Database Visualizer**: View the real-time state at `http://localhost:5555` (Prisma Studio).

##  Core Algorithm & Complexity
We use a **Greedy Selection Algorithm** to handle ride matching.
- **Complexity**: $O(K)$ where $K$ is the number of active pools. The system simulates route insertion for each candidate pool to find the minimum detour.
- **Detour Tolerance**: Uses the **Haversine Formula** to calculate great-circle distances. If the simulate detour exceeds a passenger's `maxDetourMinutes`, the pool is rejected.
- **Time Estimation**: Assumes a constant velocity (e.g., 30 km/h) to convert distance deviation into time deviation.

## 🛡 Concurrency & Safety
To support **100+ requests per second** without overbooking cabs:
- **Transactional Logic**: All allocations happen inside a `Prisma.$transaction`.
- **Double-Check Locking**: Even after the algorithm selects a cab, the system re-verifies `availableSeats` and `availableLuggage` inside the atomic transaction block.
- **Optimized Performance**: B-Tree indexes are implemented on `status` and `poolId` columns to ensure latency remains **under 300ms**.

##  Dynamic Pricing
The system encourages pooling through a reward-based formula:
- **Base Fare**: $5.00
- **Distance Rate**: $2.00 / km
- **Shared Discount**: **25% OFF** total fare if the ride is shared with at least one other passenger.
- **Calculation**: `(Base + (Dist * Rate)) * (isShared ? 0.75 : 1.0)`

##  API Documentation
- **Postman Collection**: A complete collection is included at the root: `smartRide.postman_collection.json`. 
- **Key Endpoint**: Use `POST /requests/allocate` for the end-to-end matching process.

##  Project Structure
- `src/controllers`: Request/Response handling.
- `src/services`: Core business logic (Allocation Engine).
- `src/repositories`: Atomic Database operations.
- `src/config`: Connection & Adapter setup.
- `src/utils`: Mathematical helpers (Haversine).

##  Assumptions
1. All pickup and drop-off points are within the same city/region.
2. Average transit speed is assumed to be 30km/h for detour-to-time conversion.
3. Passengers are picked up and dropped off in a First-In-First-Out (FIFO) simplified sequence for route simulation.