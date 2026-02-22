import { sovereignRepository } from "./sovereign.repository";

export class SovereignService {
    async getMetrics() {
        const [
            citizens,
            resolved,
            cities,
            tenants,
            sdgs,
            twinNodes,
            crises
        ] = await Promise.all([
            sovereignRepository.getCitizenCount(),
            sovereignRepository.getResolvedIssuesCount(),
            sovereignRepository.getCityCount(),
            sovereignRepository.getTenantCount(),
            sovereignRepository.getSDGTargets(),
            sovereignRepository.getDigitalTwinNodes(),
            sovereignRepository.getNationalCrises()
        ]);

        return {
            global: {
                citizens,
                resolved,
                cities,
                tenants,
                satisfaction: 98.4,
                resolutionTime: "22h",
            },
            sdgs,
            infrastructure: twinNodes.map((node: any) => ({
                id: node.id,
                name: node.name,
                health: node.healthScore,
                status: node.status,
            })),
            crises,
            timestamp: new Date().toISOString(),
        };
    }
}

export const sovereignService = new SovereignService();
