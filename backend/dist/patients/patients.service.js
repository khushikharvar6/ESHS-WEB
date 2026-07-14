"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uhid_generator_1 = require("../common/utils/uhid-generator");
const age_calculator_1 = require("../common/utils/age-calculator");
let PatientsService = class PatientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    flattenPatient(patient) {
        if (!patient)
            return patient;
        const { insurance, corporate, ...rest } = patient;
        return {
            ...rest,
            ...(insurance || {}),
            ...(corporate || {}),
        };
    }
    async create(dto, userId) {
        const patientCount = await this.prisma.patient.count();
        const uhid = (0, uhid_generator_1.generateUhid)(patientCount + 1);
        const age = dto.dob ? (0, age_calculator_1.calculateAge)(new Date(dto.dob)) : (dto.age || 0);
        const patientData = {
            uhid,
            salutation: dto.salutation || "",
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            age,
            dob: dto.dob,
            gender: dto.gender || "",
            bloodGroup: dto.bloodGroup,
            maritalStatus: dto.maritalStatus,
            mobileNo: dto.mobileNo || "",
            alternateMobile: dto.alternateMobile,
            emailAddress: dto.emailAddress,
            residentialAddress: dto.residentialAddress,
            city: dto.city,
            state: dto.state,
            country: dto.country || 'India',
            pincode: dto.pincode,
            emergencyContactName: dto.emergencyContactName,
            emergencyRelationship: dto.emergencyRelationship,
            emergencyPhoneNumber: dto.emergencyPhoneNumber,
            patientCategory: dto.patientCategory,
            careType: dto.careType,
            assignedDepartmentServices: dto.assignedDepartmentServices,
            assignedDepartment: dto.assignedDepartment,
            service: dto.service || "",
            registeredOn: dto.registeredOn || new Date().toISOString(),
            lastVisit: dto.lastVisit || new Date().toISOString(),
            status: dto.status || 'Active',
            initials: dto.initials || "",
            inquiryId: dto.inquiryId,
            appointmentId: dto.appointmentId,
            vip: dto.vip || false,
            updatedBy: userId,
        };
        const hasInsurance = dto.insuranceProvider || dto.policyNumber || dto.tpaNetwork || dto.insuranceContact || dto.insuranceNotes;
        if (hasInsurance) {
            patientData.insurance = {
                create: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    insuranceProvider: dto.insuranceProvider,
                    policyNumber: dto.policyNumber,
                    tpaNetwork: dto.tpaNetwork,
                    insuranceContact: dto.insuranceContact,
                    insuranceNotes: dto.insuranceNotes,
                }
            };
        }
        const hasCorporate = dto.companyName || dto.corporateId || dto.employeeId || dto.companyContact || dto.corporateAddress;
        if (hasCorporate) {
            patientData.corporate = {
                create: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    companyName: dto.companyName,
                    corporateId: dto.corporateId,
                    employeeId: dto.employeeId,
                    companyContact: dto.companyContact,
                    corporateAddress: dto.corporateAddress,
                }
            };
        }
        const patient = await this.prisma.patient.create({
            data: patientData,
            include: {
                insurance: true,
                corporate: true,
            }
        });
        return this.flattenPatient(patient);
    }
    async findAll(page = 1, limit = 20, search, department, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { uhid: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { mobileNo: { contains: search } },
            ];
        }
        if (department) {
            where.assignedDepartment = department;
        }
        const [patients, total] = await Promise.all([
            this.prisma.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    insurance: true,
                    corporate: true,
                }
            }),
            this.prisma.patient.count({ where }),
        ]);
        return {
            data: patients.map(p => this.flattenPatient(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const patient = await this.prisma.patient.findUnique({
            where: { uhid: id },
            include: {
                insurance: true,
                corporate: true,
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with id ${id} not found`);
        }
        return this.flattenPatient(patient);
    }
    async findByUhid(uhid) {
        const patient = await this.prisma.patient.findUnique({
            where: { uhid },
            include: {
                insurance: true,
                corporate: true,
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with UHID ${uhid} not found`);
        }
        return this.flattenPatient(patient);
    }
    async update(id, dto) {
        await this.findById(id);
        const age = dto.dob ? (0, age_calculator_1.calculateAge)(new Date(dto.dob)) : dto.age;
        const updateData = {
            salutation: dto.salutation,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            age: age,
            dob: dto.dob,
            gender: dto.gender,
            bloodGroup: dto.bloodGroup,
            maritalStatus: dto.maritalStatus,
            mobileNo: dto.mobileNo,
            alternateMobile: dto.alternateMobile,
            emailAddress: dto.emailAddress,
            residentialAddress: dto.residentialAddress,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            pincode: dto.pincode,
            emergencyContactName: dto.emergencyContactName,
            emergencyRelationship: dto.emergencyRelationship,
            emergencyPhoneNumber: dto.emergencyPhoneNumber,
            patientCategory: dto.patientCategory,
            careType: dto.careType,
            assignedDepartmentServices: dto.assignedDepartmentServices,
            assignedDepartment: dto.assignedDepartment,
            service: dto.service,
            status: dto.status,
            vip: dto.vip,
        };
        const hasInsurance = dto.insuranceProvider || dto.policyNumber || dto.tpaNetwork || dto.insuranceContact || dto.insuranceNotes;
        if (hasInsurance) {
            updateData.insurance = {
                upsert: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        insuranceProvider: dto.insuranceProvider,
                        policyNumber: dto.policyNumber,
                        tpaNetwork: dto.tpaNetwork,
                        insuranceContact: dto.insuranceContact,
                        insuranceNotes: dto.insuranceNotes,
                    },
                    update: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        insuranceProvider: dto.insuranceProvider,
                        policyNumber: dto.policyNumber,
                        tpaNetwork: dto.tpaNetwork,
                        insuranceContact: dto.insuranceContact,
                        insuranceNotes: dto.insuranceNotes,
                    }
                }
            };
        }
        const hasCorporate = dto.companyName || dto.corporateId || dto.employeeId || dto.companyContact || dto.corporateAddress;
        if (hasCorporate) {
            updateData.corporate = {
                upsert: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        companyName: dto.companyName,
                        corporateId: dto.corporateId,
                        employeeId: dto.employeeId,
                        companyContact: dto.companyContact,
                        corporateAddress: dto.corporateAddress,
                    },
                    update: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        companyName: dto.companyName,
                        corporateId: dto.corporateId,
                        employeeId: dto.employeeId,
                        companyContact: dto.companyContact,
                        corporateAddress: dto.corporateAddress,
                    }
                }
            };
        }
        const updated = await this.prisma.patient.update({
            where: { uhid: id },
            data: updateData,
            include: {
                insurance: true,
                corporate: true,
            }
        });
        return this.flattenPatient(updated);
    }
    async search(query) {
        const results = await this.prisma.patient.findMany({
            where: {
                OR: [
                    { uhid: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                    { mobileNo: { contains: query } },
                ],
            },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                insurance: true,
                corporate: true,
            }
        });
        return results.map(p => this.flattenPatient(p));
    }
    async deactivate(id) {
        await this.findById(id);
        return this.prisma.patient.delete({
            where: { uhid: id },
        });
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map