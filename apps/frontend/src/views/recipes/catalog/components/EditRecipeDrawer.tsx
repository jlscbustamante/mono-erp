import { NOTIFICATION } from "@/const/notification";
//import { editFinalRecipe } from "@/data/Recipe/sdk";
import { editFinalRecipe } from '@/data/Recipe/sdk'
import { Drawer, Form } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useMemo, useState } from "react";
import { FaRProject } from "react-icons/fa";
import { toast } from "react-toastify";
import { atom, useRecoilState } from "recoil";
import { IFinalRecipe } from "../../shared/types";


const recipeForEditAtom = atom<IFinalRecipe | undefined>({
    key: 'recipeForEditIngredients',
    default: undefined,
})

export const useRecipeDrawer = () => {
    const [recipe, setRecipe] = useRecoilState(recipeForEditAtom)

    const onOpen = (rec: IFinalRecipe) => {
        setRecipe(rec)
    }
    const onClose = () => {
        setRecipe(undefined)
    }

    const isOpen = useMemo(() => {
        return !!recipe
    }, [recipe])

    return {
        onOpen,
        recipe,
        onClose,
        isOpen,
    }
}

export const EditRecipeDrawer = ({ onUpdate }: { onUpdate?: () => void }) => {
    const [form] = Form.useForm()
    const { isOpen, onClose, recipe } = useRecipeDrawer()
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (recipeUp: IFinalRecipe) => {
        if (!recipe) return
        try {
            setLoading(true)
            await editFinalRecipe({...recipeUp, id: recipe.id})
            onUpdate?.()
            onClose()
            form.resetFields()
        } catch (err: any) {
            toast.error('Error al actualizar receta, ' + err.message, NOTIFICATION.error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (recipe) {
            form.setFieldsValue({
                ...recipe,
            })
        }
    }, [recipe])

    return (
        <Drawer
            title="Crear receta"
            keyboard={false}
            width={500}
            open={isOpen}
            onClose={onClose}
        >
            <Form
                form={form}
                name="updateRecipe"
                labelCol={{ span: 10 }}
                onFinish={handleUpdate}
                wrapperCol={{ span: 90 }}
            >

                <Form.Item
                name={"nameRecipe"}
                label="Nombre de receta"
                rules = {[{
                    required: true,
                    message: "Por favor, ingresa el nombre de la receta",
                }]}
                >
                    <Search
                        placeholder="Nombre de receta"
                        onSearch={(nameRecipe) => {
                            //form.setFieldsValue({ nameRecipe })
                        }}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}


