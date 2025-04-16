import { Redirect, Route, Switch } from 'react-router-dom';
import UserManagement from '../pages/UserManagement';
import DashBoard from '../pages/DashBoard';
import ProductManagement from '../pages/ProductManagement';
import LoginPage from '../pages/Auth/Login';
import CategoryMangement from '../pages/CategoryManagement';
import StoreMangement from '../pages/StoreManagement';
import TeacherManagement from '../pages/TeacherManagement';
import TopicManagement from '../pages/TopicManagement';
import CourseManagement from '../pages/CourseManagement';
import CourseDetailPage from '../pages/CourseDetail';
import OrderManagement from '../pages/OrderManagement';
import WebSocketDemo from '../pages/test';
import TrendPrediction from '../pages/TrendPrediction';
import PromotionManager from '../pages/PromotionManagement';
import TrashStoreProductManagement from '../pages/Trash';

export default function RootApp() {
  const accessToken = true;

  return (
    <Switch>
      {/* Redirect root based on login status */}
      <Route exact path="/">
        {accessToken ? <Redirect to="/home/dashboard" /> : <Redirect to="/login" />}
      </Route>

      {/* Public route */}
      <Route path="/login" component={LoginPage} />

      {/* Private routes (you could extract to <PrivateRoute> later) */}
      {accessToken && (
        <>
          <Route path="/home/dashboard" component={DashBoard} />
          <Route path="/user-management" component={UserManagement} />
          <Route path="/category-management" component={CategoryMangement} />
          <Route path="/products-management" component={ProductManagement} />
          <Route path="/trash" component={TrashStoreProductManagement} />
          <Route path="/store-management" component={StoreMangement} />
          <Route path="/home/trend" component={TrendPrediction} />
          <Route path="/course-management/teachers" component={TeacherManagement} />
          <Route path="/course-management/topics" component={TopicManagement} />
          <Route path="/course-management/courses" component={CourseManagement} />
          <Route path="/course-detail/:id" component={CourseDetailPage} />
          <Route path="/order-management" component={OrderManagement} />
          <Route path="/test" component={WebSocketDemo} />
          <Route path="/promotion-management" component={PromotionManager} />
        </>
      )}

      {/* Catch all unmatched routes */}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
