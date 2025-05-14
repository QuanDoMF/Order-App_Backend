import prisma from "@/database";
import { CreateCategoryBodyType, UpdateCategoryBodyType } from "@/schemaValidations/category.schema";
import { ppid } from "process";

export const getCategoryList = () => {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        }
    })
}

export const getCategoryListWithPagination = async (page: number, limit: number) => {
    const data = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        },
        skip: (page - 1) * limit,
        take: limit
    })
    const totalItem = await prisma.category.count()
    const totalPage = Math.ceil(totalItem / limit)
    return {
        items: data,
        totalItem,
        page,
        limit,
        totalPage
    }
}

export const createCategory = (data: CreateCategoryBodyType) => {
    return prisma.category.create({
        data
    })
}

export const updateCategory = (id: number, data: UpdateCategoryBodyType) => {
    return prisma.category.update({
        where: {
            id
        },
        data
    })
}


export const deleteCategory = (id: number) => {
    return prisma.category.delete({
      where: {
        id
      }
    })
  }
  