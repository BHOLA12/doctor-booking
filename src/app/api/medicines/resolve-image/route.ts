import { NextRequest, NextResponse } from "next/server";
import { MEDICINES } from "@/lib/medicines-data";

// Pre-defined curated images for common drugs
const CURATED_MEDICINE_IMAGES: Record<string, string> = {
  "Calpol 650": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&h=400&auto=format&fit=crop", // Clean white pills strip
  "Aspirin 75mg": "https://images.unsplash.com/photo-1628771065518-0d82f1118187?q=80&w=400&h=400&auto=format&fit=crop", // Clean generic tablets
};

// Curated fallbacks based on formulation categories
const FORMULATION_FALLBACK_IMAGES = {
  tablet: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&h=400&auto=format&fit=crop",
  capsule: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&h=400&auto=format&fit=crop",
  syrup: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&h=400&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&h=400&auto=format&fit=crop"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { medicineName, medicineId, salt, category } = body;

    if (!medicineName || !medicineId) {
      return NextResponse.json(
        { success: false, error: "Missing medicineName or medicineId parameters" },
        { status: 400 }
      );
    }

    console.log(`[Medicine Image Resolver] Resolving image for: "${medicineName}" (ID: ${medicineId})`);

    // 1. Resolve by identical composition/salt matching
    const targetSalt = salt || MEDICINES.find(m => m.id === medicineId)?.salt;
    const sameCompositionMed = MEDICINES.find(
      m => m.image && m.salt && targetSalt && m.salt.toLowerCase() === targetSalt.toLowerCase()
    );

    if (sameCompositionMed && sameCompositionMed.image) {
      console.log(`[Medicine Image Resolver] Matched composition image in catalog for salt "${targetSalt}"`);
      return NextResponse.json({
        success: true,
        medicineId,
        medicineName,
        imageUrl: sameCompositionMed.image,
        isAiGenerated: false,
        source: "composition_match",
        message: "Resolved image using identical salt/composition catalog matching."
      });
    }

    // 2. Resolve by curated brand matching
    const curatedImage = CURATED_MEDICINE_IMAGES[medicineName];
    if (curatedImage) {
      console.log(`[Medicine Image Resolver] Found curated image for "${medicineName}"`);
      return NextResponse.json({
        success: true,
        medicineId,
        medicineName,
        imageUrl: curatedImage,
        isAiGenerated: false,
        source: "curated_match",
        message: "Resolved image from curated medicine assets."
      });
    }

    // 3. Fallback to generic formulation visual template
    console.log(`[Medicine Image Resolver] No custom image found. Falling back to category formulation template.`);
    const normCategory = (category || "").toLowerCase();
    let fallbackUrl = FORMULATION_FALLBACK_IMAGES.default;
    
    if (normCategory.includes("tablet") || normCategory.includes("pill")) {
      fallbackUrl = FORMULATION_FALLBACK_IMAGES.tablet;
    } else if (normCategory.includes("capsule") || normCategory.includes("vitamin")) {
      fallbackUrl = FORMULATION_FALLBACK_IMAGES.capsule;
    } else if (normCategory.includes("syrup") || normCategory.includes("liquid")) {
      fallbackUrl = FORMULATION_FALLBACK_IMAGES.syrup;
    }

    const aiDisclaimer = "This color or image of medicine may be different. This is an AI-generated image.";

    return NextResponse.json({
      success: true,
      medicineId,
      medicineName,
      imageUrl: fallbackUrl,
      isAiGenerated: true,
      aiDisclaimer,
      source: "formulation_fallback",
      message: "Resolved using category formulation template."
    });

  } catch (error: any) {
    console.error("❌ Medicine Image Resolver error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to resolve medicine image" },
      { status: 500 }
    );
  }
}
