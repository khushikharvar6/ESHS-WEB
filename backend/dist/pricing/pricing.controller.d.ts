import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    getTests(category?: string, department?: string, search?: string): Promise<{
        id: string;
        department: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        itemType: string;
        category: string;
        subcategory: string | null;
        serviceType: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        sourceUrl: string;
    }[]>;
    getTestById(id: string): Promise<{
        id: string;
        department: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        itemType: string;
        category: string;
        subcategory: string | null;
        serviceType: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        sourceUrl: string;
    } | null>;
    getServices(): Promise<{
        id: string;
        department: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getPackages(): Promise<({
        items: ({
            test: {
                id: string;
                department: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                itemType: string;
                category: string;
                subcategory: string | null;
                serviceType: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                taxRate: import("@prisma/client/runtime/library").Decimal;
                sourceUrl: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            packageId: string;
            itemName: string;
            quantity: number;
            testId: string | null;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        sourceUrl: string;
    })[]>;
    getPackageById(id: string): Promise<({
        items: ({
            test: {
                id: string;
                department: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                itemType: string;
                category: string;
                subcategory: string | null;
                serviceType: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                taxRate: import("@prisma/client/runtime/library").Decimal;
                sourceUrl: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            packageId: string;
            itemName: string;
            quantity: number;
            testId: string | null;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        sourceUrl: string;
    }) | null>;
    getCategories(): Promise<{
        category: string;
        subcategory: string | null;
    }[]>;
    search(query: string): Promise<{
        tests: {
            id: string;
            department: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            itemType: string;
            category: string;
            subcategory: string | null;
            serviceType: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal;
            sourceUrl: string;
        }[];
        packages: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal;
            sourceUrl: string;
        }[];
        services: {
            id: string;
            department: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
}
