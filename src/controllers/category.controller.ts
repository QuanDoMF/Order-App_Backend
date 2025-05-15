import prisma from '@/database'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from '@/schemaValidations/category.schema'
import { EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { ppid } from 'process'

export const getCategoryList = () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getCategoryListWithPagination = async (page: number, limit: number) => {
  const data = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
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

export const getCategoryDetail = (id: number) => {
  return prisma.category.findUniqueOrThrow({
    where: {
      id
    }
  })
}

export const createCategory = async (data: CreateCategoryBodyType) => {
  const name = data.name.toLowerCase()
  try {
    const result = await prisma.category.create({
      data: {
        ...data,
        name
      }
    })
    return result
  } catch (error) {
    if (isPrismaClientKnownRequestError(error) && error.code === 'P2002') {
      throw new EntityError([
        {
          message: 'Tên danh mục này đã tồn tại',
          field: 'name'
        }
      ])
    }
    throw error
  }
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
