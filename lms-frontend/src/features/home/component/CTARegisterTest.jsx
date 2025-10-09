import { Button } from 'primereact/button';

export default function CTARegisterTest({ onClickStart }) {
    return (
        <div className="cta-band card-shadow">
            <h3>Experience the difference today</h3>
            <p>Join hundreds of successful students with our modern learning methodology</p>
            <Button
                label="Take the free placement test"
                onClick={onClickStart}
                className="btn-primary btn-rounded"
            />
        </div>
    );
}
