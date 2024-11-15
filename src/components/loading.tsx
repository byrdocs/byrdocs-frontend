import LoadingIcon from '@/assets/loading.svg'

export default function Loading() {

  return (
    <div className="loading-container">
      <div>
        <img src={LoadingIcon} className="loading-icon animate-spin w-20 h-20 mx-auto" />
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}
