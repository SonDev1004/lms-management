import styled from "styled-components";

const Wrapper = styled.section`
  max-width: 900px;
  margin: 60px auto 0 auto;
  text-align: center;
  padding: 0 18px 24px 18px;
`;
const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: 800;
  color: #222e3a;
  margin-bottom: 16px;
  line-height: 1.17;
  letter-spacing: -1px;
`;
const Desc = styled.p`
  font-size: 1.23rem;
  color: #222e3a;
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
  max-width: 670px;
  margin-left: auto;
  margin-right: auto;
`;

export default function Introduce() {
    return (
        <Wrapper>
            <Title>Hệ thống quản lý trung tâm Anh Ngữ</Title>
            <Desc>
                Trong hơn 5 năm hình thành &amp; phát triển, DOLEnglish đã tận dụng công nghệ tiên tiến để cho ra mắt các sản phẩm giáo dục trực tuyến<br />
                thúc đẩy sự phát triển cho hàng triệu trẻ em Việt Nam.
            </Desc>
        </Wrapper>
    );
}
