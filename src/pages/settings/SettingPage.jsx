import React, { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import MainLayout from "../../layouts/MainLayout";
import { getSettings, updateSettings } from "../../services/SettingService";
import { SettingsContext } from "../../SettingsContext";

const SettingPage = () => {
  const { logoName, setLogoName } = useContext(SettingsContext);

  // Hàm lưu setting
  const handleUpdateSetting = async () => {
    try {
        await updateSettings({ logoName });
        toast.success("Đã cập nhật");
    } catch (error) {
        console.error("Lỗi khi cập nhật: ", error);
        toast.error("Cập nhật thất bại");
    }
  };

  return (
    <MainLayout>
        <div>
            <h4>Cài đặt chung</h4>
            <hr />
            <Form>          
                <Form.Group>
                    <Form.Label style={{ fontSize: "18px" }}>Tên website</Form.Label>
                    <Form.Control
                        type="text"
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                    />
                </Form.Group>

                <Button type="submit" className="mt-3" onClick={handleUpdateSetting}>Cập nhật</Button>
            </Form>
        </div>
    </MainLayout>
  );
};

export default SettingPage;
