import LayoutNavbar from 'layouts/LayoutNavbar';

const LayoutStudent = () => {
    return (
        <>
            <div className='grid'>
                <div className='col-3'>
                    <LayoutNavbar role='student' />
                </div>
            </div>
        </>
    );
}

export default LayoutStudent;