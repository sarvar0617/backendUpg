import { productImportSchema } from "../validators/admin.validator.js";
import { importProducts } from "../services/admin.service.js";

export const importProductFile = async (req, res) => {
  const { products } = productImportSchema.parse(req.body);
  const imported = await importProducts(products);

  res.status(200).json({
    success: true,
    message: `${imported.length} ta mahsulot import qilindi.`,
    data: imported,
  });
};
