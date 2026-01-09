### 1. Raw Material Management
*   **GET** `/api/procurement/raw-materials` — `getAllRawMaterials`
*   **POST** `/api/procurement/raw-materials` — `createRawMaterial`
*   **GET** `/api/procurement/raw-materials/:id` — `getRawMaterialById`
*   **PUT** `/api/procurement/raw-materials/:id` — `updateRawMaterial`
*   **DELETE** `/api/procurement/raw-materials/:id` — `deleteRawMaterial`

### 2. Products
*   **GET** `/api/production/products` — `getAllProducts`
*   **POST** `/api/production/products` — `createProduct`
*   **GET** `/api/production/products/:id` — `getProductById`
*   **PUT** `/api/production/products/:id` — `updateProduct`
*   **DELETE** `/api/production/products/:id` — `deleteProduct`

### 3. Customer Management
*   **GET** `/api/delivery/customers` — `getAllCustomers`
*   **POST** `/api/delivery/customers` — `createCustomer`
*   **GET** `/api/delivery/customers/:id` — `getCustomerById`
*   **PUT** `/api/delivery/customers/:id` — `updateCustomer`
*   **DELETE** `/api/delivery/customers/:id` — `deleteCustomer`

### 4. Customer Order Management
*   **GET** `/api/delivery/orders` — `getAllCustomerOrders`
*   **POST** `/api/delivery/orders` — `createCustomerOrder`
*   **GET** `/api/delivery/orders/:id` — `getCustomerOrderById`
*   **PUT** `/api/delivery/orders/:id` — `updateCustomerOrder`
*   **DELETE** `/api/delivery/orders/:id` — `cancelCustomerOrder`

### 5. Supply Order Management
*   **GET** `/api/procurement/supply-orders` — `getAllSupplyOrders`
*   **POST** `/api/procurement/supply-orders` — `createSupplyOrder`
*   **GET** `/api/procurement/supply-orders/:id` — `getSupplyOrderById`
*   **PUT** `/api/procurement/supply-orders/:id` — `updateSupplyOrder`
*   **DELETE** `/api/procurement/supply-orders/:id` — `deleteSupplyOrder`

### 6. Supplier Management
*   **GET** `/api/procurement/suppliers` — `getAllSuppliers`
*   **POST** `/api/procurement/suppliers` — `createSupplier`
*   **GET** `/api/procurement/suppliers/:id` — `getSupplierById`
*   **PUT** `/api/procurement/suppliers/:id` — `updateSupplier`
*   **DELETE** `/api/procurement/suppliers/:id` — `deleteSupplier`

### 7. User Management
*   **GET** `/api/users` — `getAllUsers`
*   **POST** `/api/users` — `createUser`
*   **GET** `/api/users/:id` — `getUserById`
*   **PUT** `/api/users/:id` — `updateUser`
*   **DELETE** `/api/users/:id` — `deleteUser`

### 8. Production Orders
*   **GET** `/api/production/orders` — `getAllProductionOrders`
*   **POST** `/api/production/orders` — `createProductionOrder`
*   **GET** `/api/production/orders/:id` — `getProductionOrderById`
*   **PUT** `/api/production/orders/:id` — `updateProductionOrder`
*   **DELETE** `/api/production/orders/:id` — `cancelProductionOrder`

### 9. Delivery Management
*   **GET** `/api/delivery/deliveries` — `getAllDeliveries`
*   **POST** `/api/delivery/deliveries` — `createDelivery`
*   **GET** `/api/delivery/deliveries/:id` — `getDeliveryById`
*   **PUT** `/api/delivery/deliveries/:id` — `updateDelivery`
*   **DELETE** `/api/delivery/deliveries/:id` — `deleteDelivery`

### 10. Bill of Materials (BOM)
*   **GET** `/api/production/bom` — `getAllBillOfMaterials`
*   **POST** `/api/production/bom` — `createBillOfMaterial`
*   **GET** `/api/production/bom/:id` — `getBillOfMaterialById`
*   **PUT** `/api/production/bom/:id` — `updateBillOfMaterial`
*   **DELETE** `/api/production/bom/:id` — `deleteBillOfMaterial`